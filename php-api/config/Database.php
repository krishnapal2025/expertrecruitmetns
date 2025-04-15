<?php
class Database {
    // Database credentials
    private $host = "localhost";
    private $db_name = "job_portal";
    private $username = "root";
    private $password = "";
    private $conn;

    // Get database connection
    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8");
        } catch(PDOException $e) {
            // Log error instead of exposing sensitive information in production
            error_log("Connection error: " . $e->getMessage());
            throw new Exception("Database connection error");
        }

        return $this->conn;
    }
}
?>