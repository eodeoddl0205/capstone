# 베이스 이미지 설정
FROM node:latest as build-stage

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사 및 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# 프로덕션용 빌드
RUN npm run build

# 두 번째 스테이지: Nginx를 위한 베이스 이미지 설정
FROM nginx:latest

# Nginx 설정 파일 교체
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build-stage /app/build /usr/share/nginx/html

# HTTPS 설정 (SSL 인증서 추가)
# COPY ./certs /etc/nginx/certs

# 포트 열기 (기본 80 포트)
EXPOSE 80
EXPOSE 443

# 컨테이너 시작 시 실행할 명령 설정
CMD ["nginx", "-g", "daemon off;"]