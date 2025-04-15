<?php
class User {
    // Database connection and table name
    private $conn;
    private $table_name = "users";

    // Object properties
    public $id;
    public $email;
    public $password;
    public $userType;
    public $createdAt;

    // Constructor with DB connection
    public function __construct($db) {
        $this->conn = $db;
    }

    // Read user by ID
    public function readOne() {
        // Query to read single user
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
            $this->email = $row['email'];
            $this->password = $row['password'];
            $this->userType = $row['userType'];
            $this->createdAt = $row['createdAt'];
        }
        
        return $row;
    }

    // Read user by email
    public function readByEmail() {
        // Query to read user by email
        $query = "SELECT * FROM " . $this->table_name . " WHERE email = ?";
        
        // Prepare statement
        $stmt = $this->conn->prepare($query);
        
        // Bind email
        $stmt->bindParam(1, $this->email);
        
        // Execute query
        $stmt->execute();
        
        return $stmt;
    }

    // Create user
    public function create() {
        // Query to insert record
        $query = "INSERT INTO " . $this->table_name . " 
                  SET email=:email, password=:password, userType=:userType, createdAt=:createdAt";
        
        // Prepare query
        $stmt = $this->conn->prepare($query);
        
        // Sanitize inputs
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->userType = htmlspecialchars(strip_tags($this->userType));
        
        // Set created date
        $this->createdAt = date('Y-m-d H:i:s');
        
        // Bind values
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":userType", $this->userType);
        $stmt->bindParam(":createdAt", $this->createdAt);
        
        // Execute query
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }

    // Hash password
    public function hashPassword() {
        $this->password = password_hash($this->password, PASSWORD_BCRYPT);
    }

    // Verify password
    public function verifyPassword($suppliedPassword) {
        // Read user by email
        $stmt = $this->readByEmail();
        
        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->userType = $row['userType'];
            $this->createdAt = $row['createdAt'];
            
            // Verify password
            if(password_verify($suppliedPassword, $row['password'])) {
                return true;
            }
        }
        
        return false;
    }
}
?>