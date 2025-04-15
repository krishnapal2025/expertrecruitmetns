<?php
// Allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Load controllers
require_once __DIR__ . '/../controllers/UserController.php';
require_once __DIR__ . '/../controllers/JobController.php';
require_once __DIR__ . '/../controllers/ApplicationController.php';
require_once __DIR__ . '/../controllers/TestimonialController.php';

// Get request method and path
$request_method = $_SERVER["REQUEST_METHOD"];
$request_uri = $_SERVER["REQUEST_URI"];

// Remove query string from URI if exists
if(strpos($request_uri, '?') !== false) {
    $request_uri = strstr($request_uri, '?', true);
}

// Remove base path from URI (if your API is at /api)
$base_path = '/api';
if(strpos($request_uri, $base_path) === 0) {
    $request_uri = substr($request_uri, strlen($base_path));
}

// Instantiate controllers
$userController = new UserController();
$jobController = new JobController();
$applicationController = new ApplicationController();
$testimonialController = new TestimonialController();

// Route the request
switch ($request_uri) {
    // User routes
    case '/register':
        if ($request_method === 'POST') {
            $userController->register();
        } else {
            http_response_code(405); // Method Not Allowed
            echo json_encode(["message" => "Method not allowed"]);
        }
        break;
        
    case '/login':
        if ($request_method === 'POST') {
            $userController->login();
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Method not allowed"]);
        }
        break;
        
    case '/logout':
        if ($request_method === 'POST') {
            $userController->logout();
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Method not allowed"]);
        }
        break;
        
    case '/user':
        if ($request_method === 'GET') {
            $userController->getCurrentUser();
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Method not allowed"]);
        }
        break;
        
    // Job routes
    case '/jobs':
        if ($request_method === 'GET') {
            $jobController->getJobs();
        } else if ($request_method === 'POST') {
            $jobController->createJob();
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Method not allowed"]);
        }
        break;
        
    // Handle job detail route (/job/{id})
    case (preg_match('/^\/job\/(\d+)$/', $request_uri, $matches) ? true : false):
        $job_id = $matches[1];
        if ($request_method === 'GET') {
            $jobController->getJob($job_id);
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Method not allowed"]);
        }
        break;
        
    // Application routes
    case '/applications':
        if ($request_method === 'POST') {
            $applicationController->createApplication();
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Method not allowed"]);
        }
        break;
        
    // Applications by job seeker route
    case '/applications/jobseeker':
        if ($request_method === 'GET') {
            $applicationController->getApplicationsByJobSeekerId();
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Method not allowed"]);
        }
        break;
        
    // Handle applications by job ID route (/applications/job/{id})
    case (preg_match('/^\/applications\/job\/(\d+)$/', $request_uri, $matches) ? true : false):
        $job_id = $matches[1];
        if ($request_method === 'GET') {
            $applicationController->getApplicationsByJobId($job_id);
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Method not allowed"]);
        }
        break;
        
    // Handle application status update route (/application/{id}/status)
    case (preg_match('/^\/application\/(\d+)\/status$/', $request_uri, $matches) ? true : false):
        $application_id = $matches[1];
        if ($request_method === 'PUT') {
            $applicationController->updateApplicationStatus($application_id);
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Method not allowed"]);
        }
        break;
        
    // Testimonial routes
    case '/testimonials':
        if ($request_method === 'GET') {
            $testimonialController->getTestimonials();
        } else if ($request_method === 'POST') {
            $testimonialController->createTestimonial();
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Method not allowed"]);
        }
        break;
        
    // Handle 404 Not Found
    default:
        http_response_code(404);
        echo json_encode(["message" => "Endpoint not found"]);
        break;
}
?>