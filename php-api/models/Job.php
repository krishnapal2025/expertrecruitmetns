<?php
class Job {
    // Database connection and table name
    private $conn;
    private $table_name = "jobs";

    // Object properties
    public $id;
    public $title;
    public $description;
    public $category;
    public $location;
    public $jobType;
    public $employerId;
    public $salary;
    public $postedDate;
    public $isActive;

    // Constructor with DB connection
    public function __construct($db) {
        $this->conn = $db;
    }

    // Read all jobs with optional filters
    public function read($filters = []) {
        // Base query
        $query = "SELECT j.*, e.companyName 
                  FROM " . $this->table_name . " j
                  LEFT JOIN employers e ON j.employerId = e.id
                  WHERE 1";
        
        // Apply filters if provided
        $params = [];
        
        if(isset($filters['category']) && !empty($filters['category'])) {
            $query .= " AND j.category = ?";
            $params[] = $filters['category'];
        }
        
        if(isset($filters['location']) && !empty($filters['location'])) {
            $query .= " AND j.location = ?";
            $params[] = $filters['location'];
        }
        
        if(isset($filters['jobType']) && !empty($filters['jobType'])) {
            $query .= " AND j.jobType = ?";
            $params[] = $filters['jobType'];
        }
        
        // Default to only active jobs
        $query .= " AND j.isActive = 1";
        
        // Order by newest first
        $query .= " ORDER BY j.postedDate DESC";
        
        // Prepare statement
        $stmt = $this->conn->prepare($query);
        
        // Bind parameters if any
        for($i = 0; $i < count($params); $i++) {
            $stmt->bindParam($i + 1, $params[$i]);
        }
        
        // Execute query
        $stmt->execute();
        
        return $stmt;
    }

    // Read single job
    public function readOne() {
        // Query to read single job with employer details
        $query = "SELECT j.*, e.companyName, e.industry, e.logoPath 
                  FROM " . $this->table_name . " j
                  LEFT JOIN employers e ON j.employerId = e.id
                  WHERE j.id = ?";
        
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
            $this->title = $row['title'];
            $this->description = $row['description'];
            $this->category = $row['category'];
            $this->location = $row['location'];
            $this->jobType = $row['jobType'];
            $this->employerId = $row['employerId'];
            $this->salary = $row['salary'];
            $this->postedDate = $row['postedDate'];
            $this->isActive = $row['isActive'];
        }
        
        return $row;
    }

    // Create job
    public function create() {
        // Query to insert record
        $query = "INSERT INTO " . $this->table_name . " 
                  SET title=:title, description=:description, category=:category, 
                      location=:location, jobType=:jobType, employerId=:employerId, 
                      salary=:salary, postedDate=:postedDate, isActive=:isActive";
        
        // Prepare query
        $stmt = $this->conn->prepare($query);
        
        // Sanitize inputs
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->category = htmlspecialchars(strip_tags($this->category));
        $this->location = htmlspecialchars(strip_tags($this->location));
        $this->jobType = htmlspecialchars(strip_tags($this->jobType));
        $this->employerId = htmlspecialchars(strip_tags($this->employerId));
        $this->salary = $this->salary ? htmlspecialchars(strip_tags($this->salary)) : null;
        
        // Set posted date to current date if not provided
        $this->postedDate = date('Y-m-d H:i:s');
        
        // Default to active
        $this->isActive = 1;
        
        // Bind values
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":category", $this->category);
        $stmt->bindParam(":location", $this->location);
        $stmt->bindParam(":jobType", $this->jobType);
        $stmt->bindParam(":employerId", $this->employerId);
        $stmt->bindParam(":salary", $this->salary);
        $stmt->bindParam(":postedDate", $this->postedDate);
        $stmt->bindParam(":isActive", $this->isActive);
        
        // Execute query
        if($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        
        return false;
    }
}
?>