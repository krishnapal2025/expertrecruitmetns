<?php
class Application {
    // Database connection and table name
    private $conn;
    private $table_name = "applications";

    // Object properties
    public $id;
    public $jobId;
    public $jobSeekerId;
    public $appliedDate;
    public $status;
    public $coverLetter;

    // Constructor with DB connection
    public function __construct($db) {
        $this->conn = $db;
    }

    // Read applications by job ID
    public function readByJobId() {
        // Query to read applications by job ID with job seeker details
        $query = "SELECT a.*, js.firstName, js.lastName, js.cvPath, u.email
                  FROM " . $this->table_name . " a
                  LEFT JOIN job_seekers js ON a.jobSeekerId = js.id
                  LEFT JOIN users u ON js.userId = u.id
                  WHERE a.jobId = ?
                  ORDER BY a.appliedDate DESC";
        
        // Prepare statement
        $stmt = $this->conn->prepare($query);
        
        // Bind job ID
        $stmt->bindParam(1, $this->jobId);
        
        // Execute query
        $stmt->execute();
        
        return $stmt;
    }

    // Read applications by job seeker ID
    public function readByJobSeekerId() {
        // Query to read applications by job seeker ID with job details
        $query = "SELECT a.*, j.title, j.location, j.jobType, e.companyName
                  FROM " . $this->table_name . " a
                  LEFT JOIN jobs j ON a.jobId = j.id
                  LEFT JOIN employers e ON j.employerId = e.id
                  WHERE a.jobSeekerId = ?
                  ORDER BY a.appliedDate DESC";
        
        // Prepare statement
        $stmt = $this->conn->prepare($query);
        
        // Bind job seeker ID
        $stmt->bindParam(1, $this->jobSeekerId);
        
        // Execute query
        $stmt->execute();
        
        return $stmt;
    }

    // Read single application
    public function readOne() {
        // Query to read single application
        $query = "SELECT a.*, j.title, j.location, j.jobType, e.companyName,
                  js.firstName, js.lastName, js.cvPath, u.email
                  FROM " . $this->table_name . " a
                  LEFT JOIN jobs j ON a.jobId = j.id
                  LEFT JOIN employers e ON j.employerId = e.id
                  LEFT JOIN job_seekers js ON a.jobSeekerId = js.id
                  LEFT JOIN users u ON js.userId = u.id
                  WHERE a.id = ?";
        
        // Prepare statement
        $stmt = $this->conn->prepare($query);
        
        // Bind ID
        $stmt->bindParam(1, $this->id);
        
        // Execute query
        $stmt->execute();
        
        // Get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Set properties
        if($row) {
            $this->jobId = $row['jobId'];
            $this->jobSeekerId = $row['jobSeekerId'];
            $this->appliedDate = $row['appliedDate'];
            $this->status = $row['status'];
            $this->coverLetter = $row['coverLetter'];
        }
        
        return $row;
    }

    // Create application
    public function create() {
        // Query to insert record
        $query = "INSERT INTO " . $this->table_name . " 
                  SET jobId=:jobId, jobSeekerId=:jobSeekerId, 
                      appliedDate=:appliedDate, status=:status, coverLetter=:coverLetter";
        
        // Prepare query
        $stmt = $this->conn->prepare($query);
        
        // Sanitize inputs
        $this->jobId = htmlspecialchars(strip_tags($this->jobId));
        $this->jobSeekerId = htmlspecialchars(strip_tags($this->jobSeekerId));
        $this->coverLetter = $this->coverLetter ? htmlspecialchars(strip_tags($this->coverLetter)) : null;
        
        // Set applied date to current date
        $this->appliedDate = date('Y-m-d H:i:s');
        
        // Default status to 'pending'
        $this->status = 'pending';
        
        // Bind values
        $stmt->bindParam(":jobId", $this->jobId);
        $stmt->bindParam(":jobSeekerId", $this->jobSeekerId);
        $stmt->bindParam(":appliedDate", $this->appliedDate);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":coverLetter", $this->coverLetter);
        
        // Execute query
        if($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        
        return false;
    }

    // Update application status
    public function updateStatus() {
        // Query to update status
        $query = "UPDATE " . $this->table_name . " 
                  SET status = :status
                  WHERE id = :id";
        
        // Prepare query
        $stmt = $this->conn->prepare($query);
        
        // Sanitize inputs
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->id = htmlspecialchars(strip_tags($this->id));
        
        // Bind values
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":id", $this->id);
        
        // Execute query
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }
}
?>