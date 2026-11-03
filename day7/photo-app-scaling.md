# **SnapShare Photo-Sharing App - Scaling Plan**
### **1. Assumptions**

* **Registered Users:** 10,000,000
* **Daily Active Users (DAU):** 10% (1,000,000 active users per day)
* **Uploads per User:** Each active user uploads 1 photo per day.
* **Feed Views per User:** Each active user views 50 feed pages per day.
* **File Sizes:**
* Average original photo size = 2 MB
* Thumbnail size = 50 KB

* **Time Calculation Rule:** For system engineering estimations, 1 day $\approx$ 100,000 seconds is used.
---
### **2. Calculations**

* **Daily Active Users (DAU):**

$$10,000,000 \times 10\% = 1,000,000 \text{ users/day}$$

* **Uploads per Second:**
* Average: $1,000,000 \text{ photos/day} \div 100,000 \text{ seconds} = \mathbf{10 \text{ uploads/sec}}$
* Peak (using $5\times$ multiplier): $10 \times 5 = \mathbf{50 \text{ uploads/sec}}$

* **Feed Views per Second:**
* Total feed views per day: $1,000,000 \text{ users} \times 50 \text{ views} = 50,000,000 \text{ views/day}$
* Average: $50,000,000 \div 100,000 = \mathbf{500 \text{ views/sec}}$
* Peak (using $5\times$ multiplier): $500 \times 5 = \mathbf{2,500 \text{ views/sec}}$

* **Storage per Year:**
* Daily photo storage: $1,000,000 \text{ photos} \times 2 \text{ MB} = 2,000,000 \text{ MB} = 2,000 \text{ GB/day}$
* Annual storage (365 days): $2,000 \text{ GB} \times 365 = \mathbf{730,000 \text{ GB (or ~730 TB) per year}}$ (excluding thumbnail redundancy overhead).
---
### **3. Read-Heavy vs. Write-Heavy Statement**

* **Decision:** The system is **Read-Heavy**.
* **Explanation:** With 2,500 feed views per second at peak compared to only 50 uploads per second, users read and consume content far more frequently than they create it. Consequently, the architecture heavily relies on **Caching**, **CDNs**, and **Read Replicas** to optimize read performance.
---
### **4. Storage Strategy for Photos**
* Photos should **not** be stored inside the database because relational databases are optimized for structured, text-based queries and transactional integrity, not for storing massive binary objects (BLOBs) like 2 MB images. Storing media in a database severely degrades query performance and increases backup complexity.
* **Instead:** Photos are stored in a dedicated **Object Storage** (such as AWS S3), while only the file metadata (URL, caption, user ID, timestamps) is kept in the database.
---
### **5. Architecture Diagram**
```text
 [ Client / Mobile / Web ]
             │
             ▼
      [ CDN (Static Assets & Photos) ]
             │
             ▼
      [ Load Balancer ]
             │
             ├──────────────────────────┐
             ▼                          ▼
     [ App Server 1 ]           [ App Server 2 ]
             │                          │
             ├──────────┬───────────────┘
             ▼          ▼
         [ Cache ]  [ Object Storage (For Photos) ]
       (Redis/Mem)      │
             │          ▼
             │   [ Queue & Worker ] (For Thumbnails)
             │
             ▼
      [ Primary Database (Writes) ]
             │
             ▼ (Replication)
      [ Read Replica Database (Reads) ]

```
---
### **6. Component Descriptions (One Sentence Each)**

1. **CDN:** Delivers static content and media files from edge servers geographically close to the user to minimize latency.
2. **Load Balancer:** Distributes incoming traffic evenly across multiple application servers to prevent overloading and ensure high availability.
3. **App Server:** Executes core business logic, handles incoming API requests, and processes user actions.
4. **Cache:** Stores frequently accessed data in fast in-memory storage (RAM) to reduce database load and speed up response times.
5. **Primary Database:** Handles all write operations and data updates as the single source of truth.
6. **Read Replica:** Synchronizes with the primary database to serve read-heavy queries and offload read traffic.
7. **Object Storage:** Provides scalable, secure cloud storage specifically designed for holding large binary files and media assets.
8. **Queue & Worker:** Manages asynchronous background tasks, such as generating compressed thumbnail versions of uploaded images without blocking user requests.
---
### **7. Step-by-Step Upload Flow**

1. The client sends a `POST /photos` request containing the image file and metadata.
2. The **Load Balancer** routes the request to an available **App Server**.
3. The **App Server** uploads the raw image file directly to **Object Storage** and receives a public URL in return.
4. The **App Server** saves the metadata (caption, photo URL, user ID) into the **Primary Database**.
5. The **App Server** enqueues a background job to generate a thumbnail into the **Message Queue** and immediately responds to the client with `201 Created`.
6. A background **Worker** picks up the job from the queue, retrieves the original image, generates a 50 KB thumbnail, and stores it back in **Object Storage**.
---
### **8. Trade-offs**

1. **Speed vs. Freshness:** Utilizing **Caches** and **Read Replicas** accelerates feed loading times, but may introduce a slight replication lag where newly uploaded content takes a few seconds to appear across all follower feeds.
2. **Cost vs. Reliability:** Implementing multi-region **Object Storage**, redundant **Load Balancers**, and active database **Replication** greatly enhances fault tolerance and uptime, but significantly increases infrastructure and operational costs.