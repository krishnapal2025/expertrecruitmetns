<?php
class JobSeeker {
    // Database connection and table name
    private $conn;
    private $table_name = "job_seekers";

    // Object properties
    public $id;
    public $userId;
    public $firstName;
    public $lastName;
    public $gender;
    public $dateOfBirth;
    public $country;
    public $phoneNumber;
    public $cvPath;

    // Constructor with DB connection
    public function __construct($db) {
        $this->conn = $db;
    }

    // Read single job seeker profile
    public function readOne() {
        // Query to read single job seeker
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
        
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
            $this->userId = $row['userId'];
            $this->firstName = $row['firstName'];
            $this->lastName = $row['lastName'];
            $this->gender = $row['gender'];
            $this->dateOfBirth = $row['dateOfBirth'];
            $this->country = $row['country'];
            $this->phoneNumber = $row['phoneNumber'];
            $this->cvPath = $row['cvPath'];
        }
    }

    // Read job seeker by user ID
    public function readByUserId() {
        // Query to read job seeker by user ID
        $query = "SELECT * FROM " . $this->table_name . " WHERE userId = ?";
        
        // Prepare statement
        $stmt = $this->conn->prepare($query);
        
        // Bind user ID
        $stmt->bindParam(1, $this->userId);
        
        // Execute query
        $stmt->execute();
        
        return $stmt;
    }

    // Create job seeker profile
    public function create() {
        // Query to insert record
        $query = "INSERT INTO " . $this->table_name . " 
                  SET userId=:userId, firstName=:firstName, lastName=:lastName, 
                      gender=:gender, dateOfBirth=:dateOfBirth, country=:country, 
                      phoneNumber=:phoneNumber, cvPath=:cvPath";
        
        // Prepare query
        $stmt = $this->conn->prepare($query);
        
        // Sanitize inputs
        $this->userId = htmlspecialchars(strip_tags($this->userId));
        $this->firstName = htmlspecialchars(strip_tags($this->firstName));
        $this->lastName = htmlspecialchars(strip_tags($this->lastName));
        $this->gender = htmlspecialchars(strip_tags($this->gender));
        $this->dateOfBirth = htmlspecialchars(strip_tags($this->dateOfBirth));
        $this->country = htmlspecialchars(strip_tags($this->country));
        $this->phoneNumber = htmlspecialchars(strip_tags($this->phoneNumber));
        $this->cvPath = $this->cvPath ? htmlspecialchars(strip_tags($this->cvPath)) : null;
        
        // Bind values
        $stmt->bindParam(":userId", $this->userId);
        $stmt->bindParam(":firstName", $this->firstName);
        $stmt->bindParam(":lastName", $this->lastName);
        $stmt->bindParam(":gender", $this->gender);
        $stmt->bindParam(":dateOfBirth", $this->dateOfBirth);
        $stmt->bindParam(":country", $this->country);
        $stmt->bindParam(":phoneNumber", $this->phoneNumber);
        $stmt->bindParam(":cvPath", $this->cvPath);
        
        // Execute query
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }

    // Update job seeker profile
    public function update() {
        // Query to update record
        $query = "UPDATE " . $this->table_name . " 
                  SET firstName=:firstName, lastName=:lastName, 
                      gender=:gender, dateOfBirth=:dateOfBirth, country=:country, 
                      phoneNumber=:phoneNumber, cvPath=:cvPath
                  WHERE id=:id AND userId=:userId";
        
        // Prepare query
        $stmt = $this->conn->prepare($query);
        
        // Sanitize inputs
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->userId = htmlspecialchars(strip_tags($this->userId));
        $this->firstName = htmlspecialchars(strip_tags($this->firstName));
        $this->lastName = htmlspecialchars(strip_tags($this->lastName));
        $this->gender = htmlspecialchars(strip_tags($this->gender));
        $this->dateOfBirth = htmlspecialchars(strip_tags($this->dateOfBirth));
        $this->country = htmlspecialchars(strip_tags($this->country));
        $this->phoneNumber = htmlspecialchars(strip_tags($this->phoneNumber));
        $this->cvPath = $this->cvPath ? htmlspecialchars(strip_tags($this->cvPath)) : null;
        
        // Bind values
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":userId", $this->userId);
        $stmt->bindParam(":firstName", $this->firstName);
        $stmt->bindParam(":lastName", $this->lastName);
        $stmt->bindParam(":gender", $this->gender);
        $stmt->bindParam(":dateOfBirth", $this->dateOfBirth);
        $stmt->bindParam(":country", $this->country);
        $stmt->bindParam(":phoneNumber", $this->phoneNumber);
        $stmt->bindParam(":cvPath", $this->cvPath);
        
        // Execute query
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }
}
?>