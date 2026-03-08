# 🌐 Platform Architecture: The Edge-First Approach

The Green Automated Platform (GAP) is built on a fundamental principle: **Biological environments lack reliable internet.** Therefore, the system is designed to be fully autonomous and "Edge-First."

## 1. Decentralized Edge Compute
Unlike traditional cloud-dependent IoT systems, GAP processes critical data locally. The central API (`/gap/backend_core`) runs entirely on the physical edge device (e.g., the Raspberry Pi 5). 
* **Local High-Speed Storage:** Telemetry and mission data are logged to a local SQLite database residing on a high-speed NVMe SSD via PCIe/USB 3.1.
* **Offline Autonomy:** If connectivity is lost, the GAPbot and local sensors continue to execute their `Mission` and `MissionStep` objects autonomously.

## 2. Cloud Synchronization
When an internet connection is established, the `Sync Service` (`/gap/cloud_monitor`) quietly wakes up in the background. It securely pushes batched updates from the local SQLite database to the cloud orchestrator (Supabase). This ensures the central Mission Control dashboard is updated without interrupting real-time physical operations.

## 3. Web3 Audit Ledger (Data Integrity)
In sectors like industrial agriculture and forestry, data integrity is critical. We utilize a cryptographic Web3 Audit Ledger.
* Critical events (mode changes, safety stops, environmental anomalies) are cryptographically signed.
* We utilize quantum-resistant algorithms (like Falcon/Kyber via `liboqs-python`) to future-proof the integrity of the data stream.
