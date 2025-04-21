<?php
// Include required files
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../models/Job.php';
require_once __DIR__ . '/../models/Employer.php';
require_once __DIR__ . '/../utils/Auth.php';

class JobController {
    // Database connection
    private $db;
    private $conn;

    // Constructor
    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }

    // Get all jobs
    public function getJobs() {
        // Set response headers
        header("Content-Type: application/json");
        
        // Get filter parameters
        $category = isset($_GET['category']) ? $_GET['category'] : null;
        $location = isset($_GET['location']) ? $_GET['location'] : null;
        $jobType = isset($_GET['jobType']) ? $_GET['jobType'] : null;
        
        // Set up filters
        $filters = [];
        if($category) $filters['category'] = $category;
        if($location) $filters['location'] = $location;
        if($jobType) $filters['jobType'] = $jobType;
        
        // Instantiate job model
        $job = new Job($this->conn);
        
        // Get jobs
        $stmt = $job->read($filters);
        $num = $stmt->rowCount();
        
        if($num > 0) {
            // Jobs array
            $jobs_arr = [];
            
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $job_item = [
                    "id" => $row['id'],
                    "title" => $row['title'],
                    "description" => $row['description'],
                    "category" => $row['category'],
                    "location" => $row['location'],
                    "jobType" => $row['jobType'],
                    "employerId" => $row['employerId'],
                    "companyName" => $row['companyName'],
                    "salary" => $row['salary'],
                    "postedDate" => $row['postedDate'],
                    "isActive" => $row['isActive']
                ];
                
                array_push($jobs_arr, $job_item);
            }
            
            http_response_code(200);
            echo json_encode($jobs_arr);
        } else {
            http_response_code(200);
            echo json_encode([]);
        }
    }

    // Get a single job
    public function getJob($id) {
        // Set response headers
        header("Content-Type: application/json");
        
        // Instantiate job model
        $job = new Job($this->conn);
        $job->id = $id;
        
        // Get job details
        $job_data = $job->readOne();
        
        if($job_data) {
            // Get employer details
            $employer = new Employer($this->conn);
            $employer->id = $job->employerId;
            $employer->readOne();
            
            $response = [
                "job" => [
                    "id" => $job->id,
                    "title" => $job->title,
                    "description" => $job->description,
                    "category" => $job->category,
                    "location" => $job->location,
                    "jobType" => $job->jobType,
                    "employerId" => $job->employerId,
                    "salary" => $job->salary,
                    "postedDate" => $job->postedDate,
                    "isActive" => $job->isActive
                ],
                "employer" => [
                    "id" => $employer->id,
                    "companyName" => $employer->companyName,
                    "industry" => $employer->industry,
                    "companySize" => $employer->companySize,
                    "description" => $employer->description,
                    "logoPath" => $employer->logoPath,
                    "websiteUrl" => $employer->websiteUrl
                ]
            ];
            
            http_response_code(200);
            echo json_encode($response);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Job not found"]);
        }
    }

    // Create a new job
    public function createJob() {
        // Get posted data
        $data = json_decode(file_get_contents("php://input"));
        
        // Set response headers
        header("Content-Type: application/json");
        
        // Validate token and ensure user is an employer
        $userData = Auth::validateToken();
        
        if(!$userData || $userData['userType'] !== 'employer') {
            http_response_code(401);
            echo json_encode(["message" => "Unauthorized"]);
            return;
        }
        
        // Validate required fields
        if(
            empty($data->title) ||
            empty($data->description) ||
            empty($data->category) ||
            empty($data->location) ||
            empty($data->jobType) ||
            empty($data->employerId)
        ) {
            http_response_code(400);
            echo json_encode(["message" => "Missing required fields"]);
            return;
        }
        
        // Verify that the employer ID belongs to the current user
        $employer = new Employer($this->conn);
        $employer->id = $data->employerId;
        $employer->readOne();
        
        if($employer->userId != $userData['id']) {
            http_response_code(403);
            echo json_encode(["message" => "Forbidden"]);
            return;
        }
        
        // Instantiate job model
        $job = new Job($this->conn);
        
        // Set job properties
        $job->title = $data->title;
        $job->description = $data->description;
        $job->category = $data->category;
        $job->location = $data->location;
        $job->jobType = $data->jobType;
        $job->employerId = $data->employerId;
        $job->salary = $data->salary ?? null;
        
        // Create job
        $job_id = $job->create();
        
        if($job_id) {
            $response = [
                "id" => $job_id,
                "title" => $job->title,
                "description" => $job->description,
                "category" => $job->category,
                "location" => $job->location,
                "jobType" => $job->jobType,
                "employerId" => $job->employerId,
                "salary" => $job->salary,
                "postedDate" => $job->postedDate,
                "isActive" => $job->isActive
            ];
            
            http_response_code(201);
            echo json_encode($response);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Unable to create job"]);
        }
    }
}
?>