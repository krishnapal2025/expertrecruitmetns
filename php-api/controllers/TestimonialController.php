<?php
// Include required files
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../models/Testimonial.php';
require_once __DIR__ . '/../utils/Auth.php';

class TestimonialController {
    // Database connection
    private $db;
    private $conn;

    // Constructor
    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }

    // Get all testimonials
    public function getTestimonials() {
        // Set response headers
        header("Content-Type: application/json");
        
        // Instantiate testimonial model
        $testimonial = new Testimonial($this->conn);
        
        // Get testimonials
        $stmt = $testimonial->read();
        $num = $stmt->rowCount();
        
        if($num > 0) {
            // Testimonials array
            $testimonials_arr = [];
            
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $testimonial_item = [
                    "id" => $row['id'],
                    "name" => $row['name'],
                    "userId" => $row['userId'],
                    "role" => $row['role'],
                    "content" => $row['content'],
                    "rating" => $row['rating']
                ];
                
                array_push($testimonials_arr, $testimonial_item);
            }
            
            http_response_code(200);
            echo json_encode($testimonials_arr);
        } else {
            http_response_code(200);
            echo json_encode([]);
        }
    }

    // Create testimonial
    public function createTestimonial() {
        // Get posted data
        $data = json_decode(file_get_contents("php://input"));
        
        // Set response headers
        header("Content-Type: application/json");
        
        // Check if user is authenticated
        $userData = Auth::validateToken();
        $userId = null;
        
        if($userData) {
            $userId = $userData['id'];
        }
        
        // Validate required fields
        if(
            empty($data->name) ||
            empty($data->role) ||
            empty($data->content) ||
            !isset($data->rating) || $data->rating < 1 || $data->rating > 5
        ) {
            http_response_code(400);
            echo json_encode(["message" => "Missing or invalid required fields"]);
            return;
        }
        
        // Instantiate testimonial model
        $testimonial = new Testimonial($this->conn);
        
        // Set testimonial properties
        $testimonial->name = $data->name;
        $testimonial->userId = $userId;
        $testimonial->role = $data->role;
        $testimonial->content = $data->content;
        $testimonial->rating = $data->rating;
        
        // Create testimonial
        $testimonial_id = $testimonial->create();
        
        if($testimonial_id) {
            $response = [
                "id" => $testimonial_id,
                "name" => $testimonial->name,
                "userId" => $testimonial->userId,
                "role" => $testimonial->role,
                "content" => $testimonial->content,
                "rating" => $testimonial->rating
            ];
            
            http_response_code(201);
            echo json_encode($response);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Unable to create testimonial"]);
        }
    }
}
?>