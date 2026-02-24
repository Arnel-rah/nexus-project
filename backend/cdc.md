# Cahier des Charges - Backend Nexus

## 1. Objectif du Système
Le backend Nexus est une API REST couplée à un moteur de monitoring asynchrone. Son rôle est de superviser la disponibilité de sites web en temps réel et de servir ces données à un frontend React.

---

## 2. Spécifications Fonctionnelles

### A. Gestion des Sites (API)
* **Enregistrement** : Ajouter un site via une URL (validation du format `http/https` requise).
* **Consultation** : Lister tous les sites avec leur dernier statut connu, code HTTP et horodatage du dernier scan.
* **Suppression** : Retirer un site du monitoring (optionnel).

### B. Moteur de Monitoring (Worker)
* **Périodicité** : Exécution automatique d'un cycle de scan chaque minute.
* **Concurrence** : Chaque site doit être vérifié dans une `goroutine` indépendante pour éviter les goulots d'étranglement.
* **Timeout** : Une requête de scan ne doit pas excéder 10 secondes.

### C. Notifications (Alerting)
* **Détection de changement** : Identifier quand un site passe de l'état `UP` à `DOWN`.
* **Logging** : Tracer les erreurs de connexion (DNS, Timeout, 500) dans la console.

---

## 3. Architecture Technique

### Stack Logicielle
* **Langage** : Go (Golang) 1.25+
* **Framework Web** : Gin Gonic (Performance et routage).
* **ORM** : GORM (Interface avec PostgreSQL).
* **Base de Données** : PostgreSQL (Persistance des données).



### Modèle de Données (Entité Site)
| Champ | Type | Description |
| :--- | :--- | :--- |
| `ID` | uint | Clé primaire unique |
| `Name` | string | Nom descriptif du site |
| `URL` | string | Adresse cible (Unique/Indexée) |
| `IsUp` | boolean | État de santé actuel |
| `LastStatus` | int | Dernier code HTTP reçu |
| `UpdatedAt` | datetime | Heure du dernier contrôle |

---

## 4. Endpoints API (REST)
| Méthode | Path | Action |
| :--- | :--- | :--- |
| `GET` | `/api/ping` | Vérification santé API/DB |
| `GET` | `/api/sites` | Récupération de tous les sites |
| `POST` | `/api/sites` | Ajout d'un nouveau site |
| `DELETE` | `/api/sites/:id` | Suppression d'un site |

---

## 5. Contraintes de Qualité (Definition of Done)
* **CORS** : Les requêtes provenant de l'origine frontend doivent être autorisées.
* **Isolation** : La logique de scan doit être séparée du package `main` (utilisation du package `scanner`).
* **Dockerisation** : Le backend doit être déployable via `docker-compose`.
* **Performance** : Le temps de réponse de l'API (hors scans) doit être inférieur à 100ms.