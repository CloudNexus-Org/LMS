import AWS from '@/assets/courses/image1.png';
import Azure from '@/assets/courses/image2.png';
import JAVASCRIPT from '@/assets/courses/image3.png';
import Go from '@/assets/courses/image4.png';
import PYTHON from '@/assets/courses/image5.png';
import GCP from '@/assets/courses/image6.png';
import DOCKER from '@/assets/courses/image7.png';
import KUBERNETES from '@/assets/courses/image8.png';
import { tracks } from '@/data/tracks';

export const featuredCourses = [{
        id: 1,
        slug: "aws-solution-architect",
        title: "AWS Solution Architect",
        professor: "Dr. Arjan Singh",
        description: "Master EC2, S3, and Lambda to build highly scalable and fault-tolerant cloud infrastructures.",
        image: AWS,
        rating: 4.8,
        reviews: 2840,
        enrolled: "15.4k",
        difficulty: "Intermediate",
        duration: "24 Hours",
        modules: 12,
        lessons: 42,
        price: 2999,
        originalPrice: 5999,
        outcomes: [
            "Design highly available, multi-region architectures",
            "Master EC2, S3, Lambda, RDS, and VPC fundamentals",
            "Pass the AWS Solution Architect Associate exam",
        ],
    },
    {
        id: 2,
        slug: "azure-generative-ai",
        title: "Azure Generative AI Services",
        professor: "Sarah Jenkins",
        description: "Dive deep into generative models, neural networks, and the future of machine learning integration on Azure.",
        image: Azure,
        rating: 4.9,
        reviews: 1120,
        enrolled: "5k",
        difficulty: "Advanced",
        duration: "18 Hours",
        modules: 9,
        lessons: 32,
        price: 3499,
        originalPrice: 6999,
        outcomes: [
            "Fine-tune LLMs on Azure OpenAI Service",
            "Build production-ready RAG pipelines",
            "Deploy and monitor AI apps at scale",
        ],
    },
    {
        id: 3,
        slug: "modern-javascript",
        title: "Modern JavaScript",
        professor: "Prof. David Miller",
        description: "Build robust frontend applications with ES6+, asynchronous patterns, and scalable architectural designs.",
        image: JAVASCRIPT,
        rating: 4.7,
        reviews: 3560,
        enrolled: "12k",
        difficulty: "Beginner",
        duration: "30 Hours",
        modules: 15,
        lessons: 48,
        price: 1999,
        originalPrice: 3999,
        outcomes: [
            "Master ES6+, async/await, and modules",
            "Write tested, maintainable JavaScript",
            "Architect scalable frontend applications",
        ],
    },
    {
        id: 4,
        slug: "high-performance-go",
        title: "High Performance Go (Golang)",
        professor: "Ken Thompson Jr.",
        description: "Learn concurrency patterns and build lightning-fast microservices using Google's powerful Go language.",
        image: Go,
        rating: 4.6,
        reviews: 2180,
        enrolled: "17k",
        difficulty: "Intermediate",
        duration: "15 Hours",
        modules: 8,
        lessons: 28,
        price: 2499,
        originalPrice: 4999,
        outcomes: [
            "Master goroutines, channels, and the Go runtime",
            "Build production microservices with gRPC",
            "Profile and optimize for low-latency systems",
        ],
    },
    {
        id: 5,
        slug: "python-data-engineering",
        title: "Python for Data Engineering",
        professor: "Dr. Angela Yu",
        description: "Automate data pipelines and process large-scale datasets using advanced Python libraries and tools.",
        image: PYTHON,
        rating: 4.8,
        reviews: 4210,
        enrolled: "15k",
        difficulty: "Beginner",
        duration: "40 Hours",
        modules: 20,
        lessons: 56,
        price: 1999,
        originalPrice: 4499,
        outcomes: [
            "Build robust ETL pipelines with Pandas and Airflow",
            "Process large datasets with PySpark",
            "Ship data products to production",
        ],
    },
    {
        id: 6,
        slug: "gcp-cloud-engineering",
        title: "GCP Cloud Engineering",
        professor: "Michael Chang",
        description: "Leverage Google Cloud Platform for big data, networking, and high-performance computing solutions.",
        image: GCP,
        rating: 4.5,
        reviews: 1890,
        enrolled: "25k",
        difficulty: "Intermediate",
        duration: "20 Hours",
        modules: 10,
        lessons: 36,
        price: 2799,
        originalPrice: 5499,
        outcomes: [
            "Architect GKE, BigQuery, and Pub/Sub workloads",
            "Implement IAM and VPC networking on GCP",
            "Pass the GCP Associate Cloud Engineer exam",
        ],
    },
    {
        id: 7,
        slug: "docker-containerization",
        title: "Docker Containerization Essentials",
        professor: "James Wilson",
        description: "Package applications consistently and optimize your CI/CD pipelines with industry-standard Docker practices.",
        image: DOCKER,
        rating: 4.9,
        reviews: 5120,
        enrolled: "28k",
        difficulty: "Intermediate",
        duration: "10 Hours",
        modules: 6,
        lessons: 22,
        price: 1799,
        originalPrice: 3599,
        outcomes: [
            "Write production-ready Dockerfiles",
            "Master Docker Compose and multi-stage builds",
            "Integrate Docker into CI/CD pipelines",
        ],
    },
    {
        id: 8,
        slug: "kubernetes-production",
        title: "Kubernetes Production Mastery",
        professor: "Prof. Elena Rodriguez",
        description: "Deploy and manage large-scale container clusters with self-healing, scaling, and automated rollouts.",
        image: KUBERNETES,
        rating: 4.9,
        reviews: 2640,
        enrolled: "12k",
        difficulty: "Advanced",
        duration: "28 Hours",
        modules: 14,
        lessons: 44,
        price: 3299,
        originalPrice: 6499,
        outcomes: [
            "Deploy and operate production K8s clusters",
            "Master Helm, Operators, and service mesh",
            "Run incident-response and SRE playbooks",
        ],
    },
];

export function getCourseById(id) {
    return featuredCourses.find((c) => c.id === id) ?? null;
}

export function getCourseBySlug(slug) {
    return featuredCourses.find((c) => c.slug === slug) ?? null;
}

/** Parent career track that includes this course, if any */
export function findTrackForCourse(courseId) {
    return tracks.find((t) => t.courseIds.includes(courseId)) ?? null;
}

/** Minimal shape stored in cart / wishlist */
export function toCourseSummary(course) {
    return {
        id: course.id,
        slug: course.slug,
        title: course.title,
        professor: course.professor,
        image: course.image,
        price: course.price,
        originalPrice: course.originalPrice,
        rating: course.rating,
        reviews: course.reviews,
    };
}
