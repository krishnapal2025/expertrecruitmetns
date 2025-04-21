<?php
// Include required files
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../models/Application.php';
require_once __DIR__ . '/../models/Job.php';
require_once __DIR__ . '/../models/JobSeeker.php';
require_once __DIR__ . '/../models/Employer.php';
require_once __DIR__ . '/../utils/Auth.php';

class ApplicationController {
    // Database connection
    private $db;
    private $conn;

    // Constructor
    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }

    // Get applications by job ID
    public function getApplicationsByJobId($jobId) {
        // Set response headers
        header("Content-Type: application/json");
        
        // Validate token and ensure user is an employer
        $userData = Auth::validateToken();
        
        if(!$userData || $userData['userType'] !== 'employer') {
            http_response_code(401);
            echo json_encode(["message" => "Unauthorized"]);
            return;
        }
        
        // Verify the job belongs to the employer
        $job = new Job($this->conn);
        $job->id = $jobId;
        $job->readOne();
        
        // Get employer ID for the current user
        $employer = new Employer($this->conn);
        $employer->userId = $userData['id'];
        $stmt = $employer->readByUserId();
        $employer_data = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if(!$job->employerId || $job->employerId != $employer_data['id']) {
            http_response_code(403);
            echo json_encode(["message" => "Forbidden"]);
            return;
        }
        
        // Instantiate application model
        $application = new Application($this->conn);
        $application->jobId = $jobId;
        
        // Get applications
        $stmt = $application->readByJobId();
        $num = $stmt->rowCount();
        
        if($num > 0) {
            // Applications array
            $applications_arr = [];
            
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $application_item = [
                    "id" => $row['id'],
                    "jobId" => $row['jobId'],
                    "jobSeekerId" => $row['jobSeekerId'],
                    "appliedDate" => $row['appliedDate'],
                    "status" => $row['status'],
                    "coverLetter" => $row['coverLetter'],
                    "jobSeekerName" => $row['firstName'] . ' ' . $row['lastName'],
                    "email" => $row['email'],
                    "cvPath" => $row['cvPath']
                ];
                
                array_push($applications_arr, $application_item);
            }
            
            http_response_code(200);
            echo json_encode($applications_arr);
        } else {
            http_response_code(200);
            echo json_encode([]);
        }
    }

    // Get applications by job seeker ID
    public function getApplicationsByJobSeekerId() {
        // Set response headers
        header("Content-Type: application/json");
        
        // Validate token and ensure user is a job seeker
        $userData = Auth::validateToken();
        
        if(!$userData || $userData['userType'] !== 'jobseeker') {
            http_response_code(401);
            echo json_encode(["message" => "Unauthorized"]);
            return;
        }
        
        // Get job seeker ID for the current user
        $jobSeeker = new JobSeeker($this->conn);
        $jobSeeker->userId = $userData['id'];
        $stmt = $jobSeeker->readByUserId();
        $jobSeeker_data = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Instantiate application model
        $application = new Application($this->conn);
        $application->jobSeekerId = $jobSeeker_data['id'];
        
        // Get applications
        $stmt = $application->readByJobSeekerId();
        $num = $stmt->rowCount();
        
        if($num > 0) {
            // Applications array
            $applications_arr = [];
            
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $application_item = [
                    "id" => $row['id'],
                    "jobId" => $row['jobId'],
                    "jobSeekerId" => $row['jobSeekerId'],
                    "appliedDate" => $row['appliedDate'],
                    "status" => $row['status'],
                    "coverLetter" => $row['coverLetter'],
                    "jobTitle" => $row['title'],
                    "jobLocation" => $row['location'],
                    "jobType" => $row['jobType'],
                    "companyName" => $row['companyName']
                ];
                
                array_push($applications_arr, $application_item);
            }
            
            http_response_code(200);
            echo json_encode($applications_arr);
        } else {
            http_response_code(200);
            echo json_encode([]);
        }
    }

    // Create application
    public function createApplication() {
        // Get posted data
        $data = json_decode(file_get_contents("php://input"));
        
        // Set response headers
        header("Content-Type: application/json");
        
        // Validate token and ensure user is a job seeker
        $userData = Auth::validateToken();
        
        if(!$userData || $userData['userType'] !== 'jobseeker') {
            http_response_code(401);
            echo json_encode(["message" => "Unauthorized"]);
            return;
        }
        
        // Validate required fields
        if(
            empty($data->jobId) ||
            empty($data->jobSeekerId)
        ) {
            http_response_code(400);
            echo json_encode(["message" => "Missing required fields"]);
            return;
        }
        
        // Verify the job seeker ID belongs to the user
        $jobSeeker = new JobSeeker($this->conn);
        $jobSeeker->userId = $userData['id'];
        $stmt = $jobSeeker->readByUserId();
        $jobSeeker_data = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($jobSeeker_data['id'] != $data->jobSeekerId) {
            http_response_code(403);
            echo json_encode(["message" => "Forbidden"]);
            return;
        }
        
        // Check if job exists
        $job = new Job($this->conn);
        $job->id = $data->jobId;
        $job_data = $job->readOne();
        
        if(!$job_data) {
            http_response_code(404);
            echo json_encode(["message" => "Job not found"]);
            return;
        }
        
        // Check if already applied
        $application = new Application($this->conn);
        $application->jobId = $data->jobId;
        $application->jobSeekerId = $data->jobSeekerId;
        
        $stmt = $application->readByJobId();
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            if($row['jobSeekerId'] == $data->jobSeekerId) {
                http_response_code(400);
                echo json_encode(["message" => "Already applied to this job"]);
                return;
            }
        }
        
        // Set application properties
        $application->coverLetter = $data->coverLetter ?? null;
        
        // Create application
        $application_id = $application->create();
        
        if($application_id) {
            $response = [
                "id" => $application_id,
                "jobId" => $application->jobId,
                "jobSeekerId" => $application->jobSeekerId,
                "appliedDate" => $application->appliedDate,
                "status" => $application->status,
                "coverLetter" => $application->coverLetter
            ];
            
            http_response_code(201);
            echo json_encode($response);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Unable to create application"]);
        }
    }

    // Update application status
    public function updateApplicationStatus($id) {
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
        if(empty($data->status)) {
            http_response_code(400);
            echo json_encode(["message" => "Status is required"]);
            return;
        }
        
        // Check if application exists
        $application = new Application($this->conn);
        $application->id = $id;
        $application_data = $application->readOne();
        
        if(!$application_data) {
            http_response_code(404);
            echo json_encode(["message" => "Application not found"]);
            return;
        }
        
        // Verify the job belongs to the employer
        $job = new Job($this->conn);
        $job->id = $application->jobId;
        $job->readOne();
        
        // Get employer ID for the current user
        $employer = new Employer($this->conn);
        $employer->userId = $userData['id'];
        $stmt = $employer->readByUserId();
        $employer_data = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($job->employerId != $employer_data['id']) {
            http_response_code(403);
            echo json_encode(["message" => "Forbidden"]);
            return;
        }
        
        // Update application status
        $application->status = $data->status;
        
        if($application->updateStatus()) {
            http_response_code(200);
            echo json_encode(["message" => "Application status updated"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Unable to update application status"]);
        }
    }
}
?>