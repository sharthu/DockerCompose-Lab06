
DockerCompose-Lab06

This is Testing for Docker Compose

- **Frontend:** React 
- **Backend:** Node.js (Express) + MySQL + Redis caching 
- **Database:** MySQL 
- **Cache:** Redis 
- **Monitoring:** Prometheus + Grafana 
- **Reverse Proxy:** Nginx (optional for frontend)

## Project file Structure 

customer_registration_app
├── backend
│   ├── controllers
│   │   └── customerController.js
│   ├── Dockerfile
│   ├── metrics.js
│   ├── package.json
│   ├── package-lock.json
│   ├── routes
│   │   └── customer.js
│   ├── server.js
│   ├── server.js.bbk
│   └── server.js.bk
├── db
│   └── init.sql
├── docker-compose.yml
├── frontend
│   ├── Dockerfile
│   ├── nginx
│   │   └── default.conf
│   ├── node_modules
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── README.md
│   └── src
│       ├── App.css
│       ├── App.js
│       ├── App.test.js
│       ├── components
│       ├── index.css
│       ├── index.js
│       ├── logo.svg
│       ├── reportWebVitals.js
│       └── setupTests.js
├── prometheus
│   └── prometheus.yml
└── readme.md


Testing

Frontend : http://localhost:3000/
API : http://localhost:5000/api/customers
Metrics : http://localhost:5000/metrics
Prometheus : http://localhost:9090/targets
Grafana : http://localhost:3001/ (admin, admin)



Create backend, db, prometheus and all of files
Create frontend folder

```
cd customer_registration_app
cd frontend
npx create-react-app .
npm start
```
Testing frontend : http://localhost:3000

```
cd frontend
mkdir nginx
nano nginx/default.conf
```

Check, Edit and Change 

- frontend/src/App.js
- frontend/src/index.js
- forntend/nginx/default.conf
- backend/server.js
- backend/routes/customer.js
- backend/controllers/customerController.js
- prometheus/prometheus.yml
- docker-compose.yml


Create your custom Pages

frontend/src/
    ├── components/
    │   ├── CustomerForm.js
    │   ├── CustomerForm.css 
    │   ├── CustomerList.js
    │   └── CustomerList.css

## Commands

```
docker compose up --build
docker compose down -v
docker ps -a
```

Check Redis

```
docker ps -a | grep redis
docker exec -it redis redis-cli
> PING
PONG
```





