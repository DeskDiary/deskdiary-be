# Dockerfile

# 1. 운영체제 설치(node 18버전과 npm과 yarn이 모두 설치되어있는 리눅스)
FROM node:18-alpine

# 2. 내 컴퓨터에 있는 폴더나 파일을 도커 컴퓨터 안으로 복사하기
# 명령어를 실행할 워크 디렉토리 생성
RUN mkdir /app
WORKDIR /app

# 프로젝트 전체를 워크 디렉토리에 추가
COPY . /app

# 프로젝트에 사용되는 모듈 설치
RUN npm install

# pm2 설치
RUN npm install pm2 -g

ENV PM2_PUBLIC_KEY w3ly9zzerio92ho
ENV PM2_SECRET_KEY qezaq81hl2zd79t
# # Artillery 설치
# RUN npm install -g artillery

# RUN npm install uuid

# Nest.js 빌드
RUN npm run build

# 서버 실행
ENTRYPOINT ["pm2-runtime"]
CMD ["dist/main.js", "-i", "max"]