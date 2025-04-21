<?php
// Include required files
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/JobSeeker.php';
require_once __DIR__ . '/../models/Employer.php';
require_once __DIR__ . '/../utils/Auth.php';

class UserController {
    // Database connection
    private $db;
    private $conn;

    // Constructor
    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }

    // Register a new user
    public function register() {
        // Get posted data
        $data = json_decode(file_get_contents("php://input"));
        
        // Set response headers
        header("Content-Type: application/json");
        
        // Validate required fields
        if(
            empty($data->email) ||
            empty($data->password) ||
            empty($data->userType) ||
            !in_array($data->userType, ['jobseeker', 'employer'])
        ) {
            http_response_code(400);
            echo json_encode(["message" => "Missing required fields"]);
            return;
        }
        
        // Instantiate user model
        $user = new User($this->conn);
        
        // Set user properties
        $user->email = $data->email;
        $user->password = $data->password;
        $user->userType = $data->userType;
        
        // Check if email already exists
        $stmt = $user->readByEmail();
        if($stmt->rowCount() > 0) {
            http_response_code(400);
            echo json_encode(["message" => "Email already exists"]);
            return;
        }
        
        // Hash password
        $user->hashPassword();
        
        // Create user
        if($user->create()) {
            $userId = $this->conn->lastInsertId();
            
            // Create profile based on user type
            if($data->userType === 'jobseeker') {
                $jobSeeker = new JobSeeker($this->conn);
                $jobSeeker->userId = $userId;
                $jobSeeker->firstName = $data->firstName ?? '';
                $jobSeeker->lastName = $data->lastName ?? '';
                $jobSeeker->gender = $data->gender ?? '';
                $jobSeeker->dateOfBirth = $data->dateOfBirth ?? '';
                $jobSeeker->country = $data->country ?? '';
                $jobSeeker->phoneNumber = $data->phoneNumber ?? '';
                $jobSeeker->cvPath = $data->cvPath ?? null;
                
                if(!$jobSeeker->create()) {
                    http_response_code(500);
                    echo json_encode(["message" => "Unable to create job seeker profile"]);
                    return;
                }
                
                // Get profile ID
                $profileId = $this->conn->lastInsertId();
                
                // Generate token
                $token = Auth::generateToken($userId, $user->email, $user->userType);
                
                // Prepare response
                $response = [
                    "id" => $userId,
                    "email" => $data->email,
                    "userType" => $data->userType,
                    "token" => $token,
                    "profile" => [
                        "id" => $profileId,
                        "firstName" => $jobSeeker->firstName,
                        "lastName" => $jobSeeker->lastName,
                        "gender" => $jobSeeker->gender,
                        "dateOfBirth" => $jobSeeker->dateOfBirth,
                        "country" => $jobSeeker->country,
                        "phoneNumber" => $jobSeeker->phoneNumber,
                        "cvPath" => $jobSeeker->cvPath
                    ]
                ];
                
            } else if($data->userType === 'employer') {
                $employer = new Employer($this->conn);
                $employer->userId = $userId;
                $employer->companyName = $data->companyName ?? '';
                $employer->industry = $data->industry ?? '';
                $employer->companySize = $data->companySize ?? '';
                $employer->description = $data->description ?? '';
                $employer->logoPath = $data->logoPath ?? null;
                $employer->websiteUrl = $data->websiteUrl ?? null;
                
                if(!$employer->create()) {
                    http_response_code(500);
                    echo json_encode(["message" => "Unable to create employer profile"]);
                    return;
                }
                
                // Get profile ID
                $profileId = $this->conn->lastInsertId();
                
                // Generate token
                $token = Auth::generateToken($userId, $user->email, $user->userType);
                
                // Prepare response
                $response = [
                    "id" => $userId,
                    "email" => $data->email,
                    "userType" => $data->userType,
                    "token" => $token,
                    "profile" => [
                        "id" => $profileId,
                        "companyName" => $employer->companyName,
                        "industry" => $employer->industry,
                        "companySize" => $employer->companySize,
                        "description" => $employer->description,
                        "logoPath" => $employer->logoPath,
                        "websiteUrl" => $employer->websiteUrl
                    ]
                ];
            }
            
            http_response_code(201);
            echo json_encode($response);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Unable to create user"]);
        }
    }

    // Login
    public function login() {
        // Get posted data
        $data = json_decode(file_get_contents("php://input"));
        
        // Set response headers
        header("Content-Type: application/json");
        
        // Validate required fields
        if(
            empty($data->email) ||
            empty($data->password)
        ) {
            http_response_code(400);
            echo json_encode(["message" => "Missing required fields"]);
            return;
        }
        
        // Instantiate user model
        $user = new User($this->conn);
        
        // Set user properties
        $user->email = $data->email;
        
        // Verify password
        if($user->verifyPassword($data->password)) {
            // Get user details
            $user->readOne();
            
            // Generate token
            $token = Auth::generateToken($user->id, $user->email, $user->userType);
            
            // Get user profile
            if($user->userType === 'jobseeker') {
                $jobSeeker = new JobSeeker($this->conn);
                $jobSeeker->userId = $user->id;
                $stmt = $jobSeeker->readByUserId();
                $profile = $stmt->fetch(PDO::FETCH_ASSOC);
            } else if($user->userType === 'employer') {
                $employer = new Employer($this->conn);
                $employer->userId = $user->id;
                $stmt = $employer->readByUserId();
                $profile = $stmt->fetch(PDO::FETCH_ASSOC);
            }
            
            // Prepare response
            $response = [
                "id" => $user->id,
                "email" => $user->email,
                "userType" => $user->userType,
                "token" => $token,
                "profile" => $profile
            ];
            
            http_response_code(200);
            echo json_encode($response);
        } else {
            http_response_code(401);
            echo json_encode(["message" => "Invalid credentials"]);
        }
    }

    // Get current user
    public function getCurrentUser() {
        // Set response headers
        header("Content-Type: application/json");
        
        // Validate token
        $userData = Auth::validateToken();
        
        if(!$userData) {
            http_response_code(401);
            echo json_encode(["message" => "Unauthorized"]);
            return;
        }
        
        // Get user data
        $user = new User($this->conn);
        $user->id = $userData['id'];
        $user->readOne();
        
        // Get user profile
        if($user->userType === 'jobseeker') {
            $jobSeeker = new JobSeeker($this->conn);
            $jobSeeker->userId = $user->id;
            $stmt = $jobSeeker->readByUserId();
            $profile = $stmt->fetch(PDO::FETCH_ASSOC);
        } else if($user->userType === 'employer') {
            $employer = new Employer($this->conn);
            $employer->userId = $user->id;
            $stmt = $employer->readByUserId();
            $profile = $stmt->fetch(PDO::FETCH_ASSOC);
        }
        
        // Prepare response
        $response = [
            "id" => $user->id,
            "email" => $user->email,
            "userType" => $user->userType,
            "profile" => $profile
        ];
        
        http_response_code(200);
        echo json_encode($response);
    }

    // Logout (just a placeholder as JWT tokens are stateless)
    public function logout() {
        // Set response headers
        header("Content-Type: application/json");
        
        http_response_code(200);
        echo json_encode(["message" => "Logged out successfully"]);
    }
}
?>