import { Cloud, Sparkles, Code2, Server, Database, Cpu } from "lucide-react";

/* ----------------------------------------------------------------------
   Career tracks — used by:
   - <Courses /> (preview cards on the landing page)
   - /tracks listing page
   - /tracks/:id detail page
---------------------------------------------------------------------- */

export const tracks = [
  {
    id: "cloud",
    name: "Cloud Engineer",
    tagline: "Master AWS, Azure & GCP with engineers who built them.",
    longDescription:
      "A 16-week intensive that takes you from cloud fundamentals to production-grade multi-region architectures. You'll build, deploy, and operate real systems on AWS, Azure and GCP — graded on the same standards used at our mentors' previous employers.",
    courseIds: [1, 2, 6],
    color: "primary",
    iconKey: "cloud",
    icon: Cloud,
    leadMentorSlug: "arjan-singh",
    leadMentor: {
      name: "Dr. Arjan Singh",
      role: "Ex-AWS Principal Engineer",
      photo:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=120&h=120&fit=crop&q=80",
    },
    heroMentors: [
      {
        name: "Rohit Sharma",
        role: "Staff Cloud Architect",
        company: "Ex-AWS",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&q=80",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg",
      },
      {
        name: "Ananya Verma",
        role: "Cloud Solutions Lead",
        company: "Ex-Microsoft Azure",
        photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&q=80",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
      },
      {
        name: "Karan Patel",
        role: "Cloud Engineering Lead",
        company: "Ex-Google Cloud",
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&q=80",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
      },
    ],
    salary: "₹22 LPA",
    medianSalary: "$135k",
    activeLearners: 142,
    enrolled: "8,400+",
    rating: 4.8,
    reviews: 1240,
    badge: "Most popular",
    durationWeeks: 16,
    hoursPerWeek: "8–10",
    nextCohort: "Mon, 18 May 2026",
    level: "Intermediate to Advanced",
    language: "English",
    certificate: "Verified Cloud Engineer Certificate",
    skills: [
      "AWS",
      "Azure",
      "GCP",
      "Terraform",
      "Kubernetes",
      "Linux",
      "IAM",
      "VPC Networking",
      "Cost Optimization",
      "System Design",
    ],
    outcomes: [
      "Design highly available, multi-region cloud architectures",
      "Master IAM, VPC, and zero-trust networking patterns",
      "Operate Kubernetes clusters in production",
      "Write infrastructure as code with Terraform",
      "Optimize cost across compute, storage and networking",
      "Pass the AWS Solutions Architect Associate exam",
    ],
    curriculum: [
      {
        id: 1,
        title: "Cloud foundations & networking",
        weeks: 3,
        modules: 12,
        topics: ["Linux primer", "IAM & permissions", "VPC, subnets, routing"],
      },
      {
        id: 2,
        title: "AWS Solutions Architect deep-dive",
        weeks: 5,
        modules: 14,
        topics: ["EC2, S3, Lambda", "RDS & Aurora", "High availability"],
      },
      {
        id: 3,
        title: "Multi-cloud & Azure essentials",
        weeks: 3,
        modules: 10,
        topics: ["Azure resource model", "App services", "AKS"],
      },
      {
        id: 4,
        title: "Infrastructure as code",
        weeks: 2,
        modules: 7,
        topics: ["Terraform", "Module patterns", "State management"],
      },
      {
        id: 5,
        title: "Capstone — multi-region SaaS",
        weeks: 3,
        modules: 5,
        topics: ["Architecture review", "Cost model", "Production launch"],
      },
    ],
    projects: [
      {
        title: "Multi-region web platform",
        description:
          "Design, deploy, and load-test a multi-region web platform on AWS with automated failover and < 200ms p95.",
      },
      {
        title: "Cost optimisation audit",
        description:
          "Audit a real production account, write an actionable cost-reduction report, and implement the top 5 savings.",
      },
      {
        title: "Terraform monorepo",
        description:
          "Ship a reusable Terraform monorepo with module versioning, drift detection, and PR-driven plans.",
      },
    ],
    hiringPartners: ["Razorpay", "Swiggy", "Zerodha", "PhonePe", "Atlassian"],
    testimonials: [
      {
        author: "Karan Mehta",
        title: "Cloud Engineer @ Razorpay",
        quote:
          "Eight weeks in and I was already redesigning our staging VPC. The mentors push you exactly the right amount.",
      },
      {
        author: "Anjali Rao",
        title: "SRE @ Swiggy",
        quote:
          "Most cloud courses stop at 'hello world'. This one stops at 'production incident at 2am'.",
      },
    ],
    faq: [
      {
        q: "Do I need prior cloud experience?",
        a: "No. We start from Linux + networking fundamentals. If you have at least 1 year of any programming experience, you'll be fine.",
      },
      {
        q: "How much time do I need per week?",
        a: "8–10 hours: 2 live sessions, async videos, and one project deliverable.",
      },
      {
        q: "What does the certificate look like?",
        a: "A verifiable Cloud Engineer Certificate, signed by your mentor and linkable on LinkedIn.",
      },
      {
        q: "Is there a refund policy?",
        a: "Yes — 100% refund within the first 7 days, no questions asked.",
      },
    ],
  },
  {
    id: "ai",
    name: "AI · ML Engineer",
    tagline: "Build production-grade AI systems end to end.",
    longDescription:
      "Go from ML fundamentals to shipping LLM-powered products in production. You'll work with real datasets, build RAG pipelines, fine-tune open-source models, and deploy AI services with proper evals and monitoring.",
    courseIds: [2, 5],
    color: "accent",
    iconKey: "ai",
    icon: Sparkles,
    leadMentorSlug: "sarah-jenkins",
    leadMentor: {
      name: "Sarah Jenkins",
      role: "Ex-Microsoft AI Research Lead",
      photo:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&q=80",
    },
    heroMentors: [
      {
        name: "Priya Nair",
        role: "AI Research Lead",
        company: "Ex-OpenAI",
        photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=160&h=160&fit=crop&q=80",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      },
      {
        name: "Aditya Rao",
        role: "ML Platform Engineer",
        company: "Ex-Google DeepMind",
        photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&q=80",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
      },
      {
        name: "Meera Iyer",
        role: "NLP Engineer",
        company: "Ex-Meta AI",
        photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&h=160&fit=crop&q=80",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
      },
    ],
    salary: "₹25 LPA",
    medianSalary: "$155k",
    activeLearners: 98,
    enrolled: "5,200+",
    rating: 4.9,
    reviews: 820,
    badge: null,
    durationWeeks: 14,
    hoursPerWeek: "10–12",
    nextCohort: "Mon, 1 Jun 2026",
    level: "Advanced",
    language: "English",
    certificate: "Verified AI · ML Engineer Certificate",
    skills: [
      "PyTorch",
      "LangChain",
      "Vector DBs",
      "RAG",
      "Fine-tuning",
      "Azure OpenAI",
      "Evals",
      "MLOps",
      "Prompt Engineering",
    ],
    outcomes: [
      "Build production RAG pipelines with proper evals",
      "Fine-tune open-source LLMs on your domain data",
      "Design vector indexes and semantic search",
      "Ship AI apps with monitoring and guardrails",
      "Run rigorous offline + online evaluations",
      "Master the toolchain: LangChain, LlamaIndex, vLLM",
    ],
    curriculum: [
      {
        id: 1,
        title: "ML & deep learning refresher",
        weeks: 2,
        modules: 8,
        topics: ["Tensors", "Backprop", "Training loops"],
      },
      {
        id: 2,
        title: "Large language models",
        weeks: 3,
        modules: 10,
        topics: ["Transformer architecture", "Tokenization", "Inference"],
      },
      {
        id: 3,
        title: "Retrieval-augmented generation",
        weeks: 3,
        modules: 9,
        topics: ["Embeddings", "Vector DBs", "Hybrid retrieval"],
      },
      {
        id: 4,
        title: "Fine-tuning & adaptation",
        weeks: 2,
        modules: 7,
        topics: ["LoRA", "QLoRA", "Reward models"],
      },
      {
        id: 5,
        title: "Capstone — production AI app",
        weeks: 4,
        modules: 8,
        topics: ["Evals", "Guardrails", "Deploy"],
      },
    ],
    projects: [
      {
        title: "Domain-specific assistant",
        description:
          "Build a RAG-powered assistant on a real document corpus with eval-driven iteration and a published demo.",
      },
      {
        title: "LLM eval harness",
        description:
          "Design and implement an evaluation suite that catches regressions in tone, factuality and latency.",
      },
      {
        title: "Fine-tuned model card",
        description:
          "Fine-tune an open-source model, publish a model card, and run side-by-side comparisons with the base model.",
      },
    ],
    hiringPartners: ["Microsoft", "OpenAI partners", "Databricks", "Hugging Face", "Notion"],
    testimonials: [
      {
        author: "Devika Iyer",
        title: "ML Engineer @ Databricks",
        quote:
          "Sarah's eval-first approach completely changed how I ship LLM features. I now refuse to ship without one.",
      },
    ],
    faq: [
      {
        q: "Do I need to know deep learning?",
        a: "We'll do a 2-week refresher. Familiarity with Python + basic linear algebra is enough to start.",
      },
      {
        q: "Will I get GPU access?",
        a: "Yes — you'll get credits for our managed GPU cluster for fine-tuning and inference experiments.",
      },
    ],
  },
  {
    id: "fullstack",
    name: "Full-Stack Builder",
    tagline: "Ship modern web apps with Go and JavaScript.",
    longDescription:
      "An end-to-end builder track that takes you from idea to shipped product. Modern JavaScript on the frontend, Go on the backend, and the production craft in between.",
    courseIds: [3, 4],
    color: "success",
    iconKey: "fullstack",
    icon: Code2,
    leadMentorSlug: "david-miller",
    leadMentor: {
      name: "Prof. David Miller",
      role: "Ex-Meta Senior Frontend Engineer",
      photo:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80",
    },
    heroMentors: [
      {
        name: "Arjun Mehta",
        role: "Senior Frontend Engineer",
        company: "Ex-Netflix",
        photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&h=160&fit=crop&q=80",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      },
      {
        name: "Priya Kapoor",
        role: "React Architect",
        company: "Ex-Adobe",
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&q=80",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
      },
      {
        name: "Rohan Singh",
        role: "UI Systems Engineer",
        company: "Ex-Stripe",
        photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&h=160&fit=crop&q=80",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      },
    ],
    salary: "₹18 LPA",
    medianSalary: "$120k",
    activeLearners: 76,
    enrolled: "12,100+",
    rating: 4.7,
    reviews: 1980,
    badge: null,
    durationWeeks: 18,
    hoursPerWeek: "8",
    nextCohort: "Mon, 25 May 2026",
    level: "Beginner to Intermediate",
    language: "English",
    certificate: "Verified Full-Stack Engineer Certificate",
    skills: [
      "JavaScript",
      "React",
      "TypeScript",
      "Next.js",
      "Go",
      "Postgres",
      "REST/gRPC",
      "Testing",
      "Performance",
    ],
    outcomes: [
      "Architect maintainable React + TypeScript apps",
      "Build performant Go services with proper testing",
      "Design real-world databases with Postgres",
      "Implement authentication and authorization",
      "Ship a portfolio-grade full-stack product",
    ],
    curriculum: [
      {
        id: 1,
        title: "Modern JavaScript & React",
        weeks: 4,
        modules: 15,
        topics: ["ES6+", "React patterns", "Testing"],
      },
      {
        id: 2,
        title: "TypeScript & Next.js",
        weeks: 3,
        modules: 10,
        topics: ["TS deep-dive", "Server actions", "Streaming"],
      },
      {
        id: 3,
        title: "Go backend",
        weeks: 4,
        modules: 12,
        topics: ["HTTP, JSON, gRPC", "Postgres", "Testing"],
      },
      {
        id: 4,
        title: "Auth, deploy, observe",
        weeks: 3,
        modules: 9,
        topics: ["OAuth/JWT", "CI/CD", "Logging"],
      },
      {
        id: 5,
        title: "Capstone — full-stack product",
        weeks: 4,
        modules: 6,
        topics: ["Spec", "Build", "Ship"],
      },
    ],
    projects: [
      {
        title: "Realtime collaboration tool",
        description:
          "Build a Figma-style realtime cursor + document collaboration tool with Go on the backend.",
      },
      {
        title: "Multi-tenant SaaS starter",
        description:
          "Architect a multi-tenant SaaS with Stripe billing, role-based auth, and audit logs.",
      },
    ],
    hiringPartners: ["Stripe", "Linear", "Vercel", "Razorpay", "Notion"],
    testimonials: [
      {
        author: "Suresh K.",
        title: "Frontend Engineer @ Linear",
        quote:
          "David's React patterns module alone was worth the price of admission.",
      },
    ],
    faq: [
      {
        q: "I'm a beginner. Is this for me?",
        a: "Yes — we start from modern JavaScript fundamentals. You should be comfortable writing code, but no React/Go experience needed.",
      },
      {
        q: "Do I build a real portfolio?",
        a: "Yes — the capstone is a polished, deployed full-stack product that you'll demo on the final cohort call.",
      },
    ],
  },
  {
    id: "devops",
    name: "DevOps Engineer",
    tagline: "Orchestrate, scale and deploy — like a real SRE.",
    longDescription:
      "Become the engineer every team needs. Container fundamentals, Kubernetes in production, CI/CD pipelines that actually catch regressions, and observability that catches incidents before users do.",
    courseIds: [7, 8],
    color: "warning",
    iconKey: "devops",
    icon: Server,
    leadMentorSlug: "james-wilson",
    leadMentor: {
      name: "James Wilson",
      role: "Ex-Google DevOps Principal",
      photo:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&q=80",
    },
    heroMentors: [
      {
        name: "Vikram Joshi",
        role: "Principal Backend Engineer",
        company: "Ex-Uber",
        photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&h=160&fit=crop&q=80",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
      },
      {
        name: "Sneha Gupta",
        role: "API Platform Lead",
        company: "Ex-Razorpay",
        photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop&q=80",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
      },
      {
        name: "Amit Verma",
        role: "Systems Architect",
        company: "Ex-Flipkart",
        photo: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=160&h=160&fit=crop&q=80",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
      },
    ],
    salary: "₹20 LPA",
    medianSalary: "$140k",
    activeLearners: 64,
    enrolled: "11,300+",
    rating: 4.7,
    reviews: 1720,
    badge: null,
    durationWeeks: 14,
    hoursPerWeek: "8–10",
    nextCohort: "Mon, 8 Jun 2026",
    level: "Intermediate to Advanced",
    language: "English",
    certificate: "Verified DevOps Engineer Certificate",
    skills: [
      "Docker",
      "Kubernetes",
      "GitOps",
      "Argo",
      "Terraform",
      "Prometheus",
      "Grafana",
      "Helm",
    ],
    outcomes: [
      "Operate Kubernetes clusters in production",
      "Build CI/CD pipelines with quality gates",
      "Implement GitOps with Argo CD",
      "Instrument services with proper metrics & traces",
      "Run effective on-call and post-mortems",
    ],
    curriculum: [
      {
        id: 1,
        title: "Containers & Docker",
        weeks: 2,
        modules: 8,
        topics: ["Images", "Multi-stage", "Registries"],
      },
      {
        id: 2,
        title: "Kubernetes deep-dive",
        weeks: 5,
        modules: 16,
        topics: ["Pods, services, ingress", "Helm", "Operators"],
      },
      {
        id: 3,
        title: "CI/CD & GitOps",
        weeks: 3,
        modules: 10,
        topics: ["Pipelines", "Argo CD", "Promotion"],
      },
      {
        id: 4,
        title: "Observability & incident response",
        weeks: 2,
        modules: 8,
        topics: ["Prometheus", "Traces", "Run-books"],
      },
      {
        id: 5,
        title: "Capstone — production K8s platform",
        weeks: 2,
        modules: 5,
        topics: ["Design", "Deploy", "Operate"],
      },
    ],
    projects: [
      {
        title: "Production-grade K8s platform",
        description:
          "Stand up a multi-environment K8s platform with GitOps deploys and a working alert pipeline.",
      },
      {
        title: "Incident game-day",
        description:
          "Run a live incident with chaos-injected failures and write a real post-mortem.",
      },
    ],
    hiringPartners: ["Google Cloud", "Datadog", "GitLab", "Hashicorp"],
    testimonials: [
      {
        author: "Nikhil A.",
        title: "Platform Engineer @ Razorpay",
        quote:
          "James runs incident games like the real thing. I learned more in one weekend than in two years of theory.",
      },
    ],
    faq: [
      {
        q: "How much Linux do I need?",
        a: "Comfortable on the command line and with basic networking concepts (DNS, HTTP, TCP).",
      },
    ],
  },
  {
    id: "data",
    name: "Data Engineer",
    tagline: "Move terabytes with Python pipelines and cloud warehouses.",
    longDescription:
      "Build the data plumbing modern companies run on. From batch ETL to streaming, modeling to orchestration, this track teaches the trade-offs senior data engineers make on real platforms.",
    courseIds: [5, 6, 3],
    color: "primary",
    iconKey: "data",
    icon: Database,
    leadMentorSlug: "angela-yu",
    leadMentor: {
      name: "Dr. Angela Yu",
      role: "Ex-Netflix Data Engineering Lead",
      photo:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80",
    },
    heroMentors: [
      {
        name: "Nikhil Reddy",
        role: "Staff SRE",
        company: "Ex-Shopify",
        photo: "https://images.unsplash.com/photo-1548449112-96a38a643324?w=160&h=160&fit=crop&q=80",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",
      },
      {
        name: "Divya Menon",
        role: "DevOps Architect",
        company: "Ex-HashiCorp",
        photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=160&h=160&fit=crop&q=80",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg",
      },
      {
        name: "Rahul Saxena",
        role: "Platform Engineer",
        company: "Ex-GitLab",
        photo: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=160&h=160&fit=crop&q=80",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
      },
    ],
    salary: "₹24 LPA",
    medianSalary: "$145k",
    activeLearners: 89,
    enrolled: "9,700+",
    rating: 4.9,
    reviews: 1530,
    badge: null,
    durationWeeks: 16,
    hoursPerWeek: "8–10",
    nextCohort: "Mon, 15 Jun 2026",
    level: "Intermediate",
    language: "English",
    certificate: "Verified Data Engineer Certificate",
    skills: [
      "Python",
      "SQL",
      "Spark",
      "Airflow",
      "dbt",
      "Snowflake",
      "Kafka",
      "Data Modeling",
    ],
    outcomes: [
      "Build batch and streaming pipelines that don't lose data",
      "Model warehouses for analytics that scale",
      "Orchestrate with Airflow and dbt at production quality",
      "Tune Spark for cost and latency",
      "Design data contracts that hold up over time",
    ],
    curriculum: [
      {
        id: 1,
        title: "Python & SQL for data",
        weeks: 3,
        modules: 10,
        topics: ["Pandas", "SQL patterns", "Window functions"],
      },
      {
        id: 2,
        title: "Batch with Spark & Airflow",
        weeks: 4,
        modules: 13,
        topics: ["PySpark", "DAGs", "Idempotency"],
      },
      {
        id: 3,
        title: "Warehousing with Snowflake & dbt",
        weeks: 3,
        modules: 10,
        topics: ["Modeling", "Tests", "Lineage"],
      },
      {
        id: 4,
        title: "Streaming with Kafka",
        weeks: 3,
        modules: 9,
        topics: ["Producers", "Consumers", "Exactly-once"],
      },
      {
        id: 5,
        title: "Capstone — data platform",
        weeks: 3,
        modules: 6,
        topics: ["Spec", "Build", "Document"],
      },
    ],
    projects: [
      {
        title: "End-to-end analytics stack",
        description:
          "Ingest, model and ship a dashboard backed by Snowflake + dbt + Airflow + Looker.",
      },
      {
        title: "Streaming events pipeline",
        description:
          "Build a Kafka-based event pipeline with schema registry and consumer reliability.",
      },
    ],
    hiringPartners: ["Netflix", "Spotify", "Airtel", "Atlassian"],
    testimonials: [
      {
        author: "Pooja S.",
        title: "Data Engineer @ Spotify",
        quote:
          "Angela teaches data engineering like infrastructure. That's exactly the mental model I needed.",
      },
    ],
    faq: [
      {
        q: "Do I need to know Spark?",
        a: "No — we cover Spark from scratch. Python familiarity is enough to start.",
      },
    ],
  },
  {
    id: "backend",
    name: "Backend Architect",
    tagline: "Design APIs and services that scale to millions of requests.",
    longDescription:
      "Move beyond CRUD. Learn service design, async patterns, observability, and the production craft of senior backend engineers at companies like Stripe and Twilio.",
    courseIds: [4, 5, 7],
    color: "accent",
    iconKey: "backend",
    icon: Cpu,
    leadMentorSlug: "elena-rodriguez",
    leadMentor: {
      name: "Prof. Elena Rodriguez",
      role: "Ex-Stripe Distributed Systems Lead",
      photo:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80",
    },
    heroMentors: [
      {
        name: "Tanvi Shah",
        role: "Data Engineering Lead",
        company: "Ex-Airbnb",
        photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=160&h=160&fit=crop&q=80",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg",
      },
      {
        name: "Suresh Pillai",
        role: "Staff Data Engineer",
        company: "Ex-Databricks",
        photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=160&h=160&fit=crop&q=80",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachespark/apachespark-original.svg",
      },
      {
        name: "Kavya Nair",
        role: "Analytics Architect",
        company: "Ex-Netflix",
        photo: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=160&h=160&fit=crop&q=80",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
      },
    ],
    salary: "₹26 LPA",
    medianSalary: "$160k",
    activeLearners: 71,
    enrolled: "6,800+",
    rating: 4.8,
    reviews: 1080,
    badge: "Hot",
    durationWeeks: 16,
    hoursPerWeek: "9",
    nextCohort: "Mon, 22 Jun 2026",
    level: "Advanced",
    language: "English",
    certificate: "Verified Backend Architect Certificate",
    skills: [
      "System Design",
      "Postgres",
      "Kafka",
      "gRPC",
      "Go",
      "Idempotency",
      "Event Sourcing",
      "Service Mesh",
    ],
    outcomes: [
      "Design fault-tolerant distributed systems",
      "Implement idempotency and exactly-once semantics",
      "Choose between sync and async patterns thoughtfully",
      "Operate Postgres at scale (locks, indexes, partitioning)",
      "Conduct production-grade system design interviews",
    ],
    curriculum: [
      {
        id: 1,
        title: "Service design foundations",
        weeks: 3,
        modules: 10,
        topics: ["APIs", "Versioning", "Contracts"],
      },
      {
        id: 2,
        title: "Data plane: Postgres deep-dive",
        weeks: 3,
        modules: 11,
        topics: ["Indexes", "Locks", "Partitioning"],
      },
      {
        id: 3,
        title: "Async patterns & messaging",
        weeks: 4,
        modules: 12,
        topics: ["Kafka", "Idempotency", "Event sourcing"],
      },
      {
        id: 4,
        title: "Service mesh & reliability",
        weeks: 3,
        modules: 9,
        topics: ["Retries", "Circuit breakers", "Rate limits"],
      },
      {
        id: 5,
        title: "Capstone — payment-grade backend",
        weeks: 3,
        modules: 6,
        topics: ["Design", "Build", "Stress test"],
      },
    ],
    projects: [
      {
        title: "Payment ledger service",
        description:
          "Design and implement an accounting-grade payment ledger with idempotency and audit trails.",
      },
      {
        title: "Event-sourced API",
        description:
          "Build an event-sourced backend with replay, snapshots, and full history queries.",
      },
    ],
    hiringPartners: ["Stripe", "Razorpay", "Twilio", "Plaid"],
    testimonials: [
      {
        author: "Tarun B.",
        title: "Senior Backend Engineer @ Stripe",
        quote:
          "Elena's idempotency module is now a recommended read for every new hire on my team.",
      },
    ],
    faq: [
      {
        q: "Is this an interview-prep track?",
        a: "Partly — you'll come out interview-ready for staff-level backend roles, but the goal is to make you a better builder.",
      },
    ],
  },
];

export function getTrackById(id) {
  return tracks.find((t) => t.id === id);
}

/* ----------------------------------------------------------------------
   Lesson derivation
   We expand each curriculum entry (course) into a flat list of lessons:
   - 1 "Welcome" intro video
   - 1 video lesson per `topic`
   - 1 short "Practice" quiz at the end of the course
   - 1 final "Project" task
   This gives us a real-feeling lesson roster for the player without us
   having to author dozens of titles by hand.
---------------------------------------------------------------------- */

const TYPE_DURATIONS = {
  video: ["8 min", "11 min", "14 min", "9 min", "12 min", "16 min", "10 min"],
  reading: ["6 min read", "8 min read", "5 min read"],
  quiz: ["10 questions", "12 questions", "8 questions"],
  project: ["~2 hours"],
};

function pick(arr, seed) {
  return arr[seed % arr.length];
}

export function getLessonsByTrack(trackId) {
  const track = getTrackById(trackId);
  if (!track) return [];

  const lessons = [];
  let order = 0;

  track.curriculum.forEach((course, ci) => {
    const baseId = `${trackId}-c${ci + 1}`;

    lessons.push({
      id: `${baseId}-intro`,
      order: ++order,
      courseId: course.id,
      courseTitle: course.title,
      courseIndex: ci,
      title: `Welcome to ${course.title}`,
      type: "video",
      duration: pick(TYPE_DURATIONS.video, ci),
      summary: `An overview of what you'll cover in this course — the goals, the rough timeline, and the project you'll ship at the end.`,
    });

    course.topics.forEach((topic, ti) => {
      lessons.push({
        id: `${baseId}-l${ti + 1}`,
        order: ++order,
        courseId: course.id,
        courseTitle: course.title,
        courseIndex: ci,
        title: topic,
        type: "video",
        duration: pick(TYPE_DURATIONS.video, ci + ti + 1),
        summary: `Walkthrough of ${topic} with hands-on demonstration. By the end of this lesson you'll be able to apply ${topic} in production code.`,
      });
    });

    lessons.push({
      id: `${baseId}-reading`,
      order: ++order,
      courseId: course.id,
      courseTitle: course.title,
      courseIndex: ci,
      title: `Recommended reading`,
      type: "reading",
      duration: pick(TYPE_DURATIONS.reading, ci),
      summary: `A curated reading list to deepen what you covered in the videos above.`,
    });

    lessons.push({
      id: `${baseId}-quiz`,
      order: ++order,
      courseId: course.id,
      courseTitle: course.title,
      courseIndex: ci,
      title: `Practice quiz — ${course.title}`,
      type: "quiz",
      duration: pick(TYPE_DURATIONS.quiz, ci),
      summary: `A short knowledge check to make sure the key ideas have landed.`,
    });
  });

  // Final capstone project lesson
  lessons.push({
    id: `${trackId}-capstone`,
    order: ++order,
    courseId: -1,
    courseTitle: "Capstone",
    courseIndex: track.curriculum.length,
    title: `Capstone — ship it`,
    type: "project",
    duration: pick(TYPE_DURATIONS.project, 0),
    summary: `Apply everything you've learned to a real, portfolio-grade project reviewed by your mentor.`,
  });

  return lessons;
}

export function getLessonById(trackId, lessonId) {
  const lessons = getLessonsByTrack(trackId);
  return lessons.find((l) => l.id === lessonId) || lessons[0] || null;
}

