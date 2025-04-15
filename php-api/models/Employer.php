<?php
class Employer {
    // Database connection and table name
    private $conn;
    private $table_name = "employers";

    // Object properties
    public $id;
    public $userId;
    public $companyName;
    public $industry;
    public $companySize;
    public $description;
    public $logoPath;
    public $websiteUrl;

    // Constructor with DB connection
    public function __construct($db) {
        $this->conn = $db;
    }

    // Get employer by ID
    public function readOne() {
        // Query to read single employer
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
            $this->companyName = $row['companyName'];
            $this->industry = $row['industry'];
            $this->companySize = $row['companySize'];
            $this->description = $row['description'];
            $this->logoPath = $row['logoPath'];
            $this->websiteUrl = $row['websiteUrl'];
        }
    }

    // Get employer by user ID
    public function readByUserId() {
        // Query to read employer by user ID
        $query = "SELECT * FROM " . $this->table_name . " WHERE userId = ?";
        
        // Prepare statement
        $stmt = $this->conn->prepare($query);
        
        // Bind user ID
        $stmt->bindParam(1, $this->userId);
        
        // Execute query
        $stmt->execute();
        
        return $stmt;
    }

    // Create employer
    public function create() {
        // Query to insert record
        $query = "INSERT INTO " . $this->table_name . " 
                  SET userId=:userId, companyName=:companyName, industry=:industry, 
                      companySize=:companySize, description=:description, 
                      logoPath=:logoPath, websiteUrl=:websiteUrl";
        
        // Prepare query
        $stmt = $this->conn->prepare($query);
        
        // Sanitize inputs
        $this->userId = htmlspecialchars(strip_tags($this->userId));
        $this->companyName = htmlspecialchars(strip_tags($this->companyName));
        $this->industry = htmlspecialchars(strip_tags($this->industry));
        $this->companySize = htmlspecialchars(strip_tags($this->companySize));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->logoPath = $this->logoPath ? htmlspecialchars(strip_tags($this->logoPath)) : null;
        $this->websiteUrl = $this->websiteUrl ? htmlspecialchars(strip_tags($this->websiteUrl)) : null;
        
        // Bind values
        $stmt->bindParam(":userId", $this->userId);
        $stmt->bindParam(":companyName", $this->companyName);
        $stmt->bindParam(":industry", $this->industry);
        $stmt->bindParam(":companySize", $this->companySize);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":logoPath", $this->logoPath);
        $stmt->bindParam(":websiteUrl", $this->websiteUrl);
        
        // Execute query
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }
}
?>