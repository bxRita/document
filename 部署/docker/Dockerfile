# 选择registry.ebrserver更小体积的基础nginx镜像
FROM nginx:alpine
RUN chmod 777 -R /etc/nginx/conf.d/
COPY ./dist /usr/share/nginx/html/
COPY ./default.conf /etc/nginx/conf.d/default.conf

RUN chmod 777 -R /usr/share/nginx/html/
