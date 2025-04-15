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

    // Get all users
    public function read() {
        // Query to read all users
        $query = "SELECT * FROM " . $this->table_name;
        
        // Prepare statement
        $stmt = $this->conn->prepare($query);
        
        // Execute query
        $stmt->execute();
        
        return $stmt;
    }

    // Get single user by ID
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
            $this->userType = $row['userType'];
            $this->createdAt = $row['createdAt'];
        }
    }

    // Get user by email
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
        $this->password = htmlspecialchars(strip_tags($this->password));
        $this->userType = htmlspecialchars(strip_tags($this->userType));
        
        // Current timestamp for created_at
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

    // Verify user password
    public function verifyPassword($password) {
        // Check if user exists
        $stmt = $this->readByEmail();
        
        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->userType = $row['userType'];
            $stored_password = $row['password'];
            
            // Verify password
            if(password_verify($password, $stored_password)) {
                return true;
            }
        }
        
        return false;
    }

    // Hash password
    public function hashPassword() {
        // Hash the password before storing
        $this->password = password_hash($this->password, PASSWORD_BCRYPT);
    }
}
?>