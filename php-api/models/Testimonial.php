<?php
class Testimonial {
    // Database connection and table name
    private $conn;
    private $table_name = "testimonials";

    // Object properties
    public $id;
    public $name;
    public $userId;
    public $role;
    public $content;
    public $rating;

    // Constructor with DB connection
    public function __construct($db) {
        $this->conn = $db;
    }

    // Read all testimonials
    public function read() {
        // Query to read all testimonials
        $query = "SELECT * FROM " . $this->table_name . "
                  ORDER BY id DESC";
        
        // Prepare statement
        $stmt = $this->conn->prepare($query);
        
        // Execute query
        $stmt->execute();
        
        return $stmt;
    }

    // Read single testimonial
    public function readOne() {
        // Query to read single testimonial
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
            $this->name = $row['name'];
            $this->userId = $row['userId'];
            $this->role = $row['role'];
            $this->content = $row['content'];
            $this->rating = $row['rating'];
        }
    }

    // Create testimonial
    public function create() {
        // Query to insert record
        $query = "INSERT INTO " . $this->table_name . " 
                  SET name=:name, userId=:userId, role=:role, content=:content, rating=:rating";
        
        // Prepare query
        $stmt = $this->conn->prepare($query);
        
        // Sanitize inputs
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->role = htmlspecialchars(strip_tags($this->role));
        $this->content = htmlspecialchars(strip_tags($this->content));
        $this->rating = htmlspecialchars(strip_tags($this->rating));
        
        // Bind values
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":userId", $this->userId);
        $stmt->bindParam(":role", $this->role);
        $stmt->bindParam(":content", $this->content);
        $stmt->bindParam(":rating", $this->rating);
        
        // Execute query
        if($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        
        return false;
    }
}
?>