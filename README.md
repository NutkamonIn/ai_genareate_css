ขั้นตอนที่1
```sh
git clone https://github.com/NutkamonIn/backup
```
ขั้นตอนที่2
```sh
cd backup
```
ขั้นตอนที่3
```sh
npm install
```
ขั้นตอนที่4
```sh
docker-compsoe -p <your-project-name> up --build -d
```
ขั้นตอนที่5
เปิด terminal แล้วใช้คำสั่งตามนี้
```sh
docker -exec -it ollama bash
ollama pull tinyllama
```
หลังโหลดเสร็จให้
```sh
exit
```
ขั้นตอนการ เอา images ขึ้น docker hub
ขั้นตอนที่1
```sh
docker images
```
หา images id ของ images project
ขั้นตอนที่ 2
```sh
docker tag <IMAGE_ID> <DOCKER_HUB_USERNAME>/<REPO_NAME>:<TAG>
```
ขั้นตอนที่ 3
```sh
docker push <DOCKER_HUB_USERNAME>/<REPO_NAME>:<TAG>
```
