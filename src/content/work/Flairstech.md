---
company: "Flairstech"
role: "System Administrator"
dateStart: "01/01/2026"
dateEnd: "Current"
---

### Things that I have done:
- Designed and operationalized a centralized Wazuh SIEM/XDR platform on AWS for more than 200
Windows and Linux servers, scaling the environment and adding 1 TB of dedicated index storage to
support security-data growth
- Developed PowerShell and WinRM automation for large-scale Wazuh agent deployment across
Windows servers, including host reachability checks, TCP connectivity validation, existing-service
detection, remote MSI installation, agent grouping, FQDN-based naming, service startup, and post-
installation validation.
- Investigated and resolved a complex FortiGate IPsec/BGP routing incident where traffic entered
through the intended VPN tunnel but was dropped by Reverse Path Forwarding because BGP selected a
different return path. Used FortiGate packet sniffing, flow debugging, routing-table inspection, and BGP
path analysis to identify the asymmetric-routing condition.
- Implemented a targeted BGP routing policy using a prefix list, inbound route map, and Local
Preference to prefer the intended IPsec path while preserving the alternative route as a backup.
Performed BGP route refresh/reprocessing and verified restoration of symmetric routing without
disabling FortiGate security controls.
- Automated AWS migration preparation using PowerShell scripts for MGN agent deployment, server
inventory collection, and DNS cutover; migrated on-premises workloads and supported SQL Server
CDC and post-migration connectivity troubleshooting.
- Administered Zabbix monitoring across 250 servers and resolved monitoring-storage growth by
cleaning aged data and implementing controlled retention and housekeeping.
- Upgraded and stabilized a Snipe-IT asset-management application stack, including migration to
Ubuntu 24.04, PHP 8.3/PHP-FPM configuration changes, and Nginx compatibility troubleshooting.
- Created a server inventory automation script that collected hostname, IP address, OS version, and availability status to streamline migration planning
- Configured AWS IAM policies based on the principle of least privilege
- Maintained core infrastructure services including Active Directory, DNS, Windows Server, Linux
services, application platforms, and operational monitoring.