# 选择registry.ebrserver更小体积的基础nginx镜像
FROM nginx:alpine
RUN chmod 777 -R /etc/nginx/conf.d/
RUN chmod 777 -R /usr/share/nginx/html

# nginx 配置文件
COPY ./default.conf /etc/nginx/conf.d/default.conf
# 多个vue项目的dist文件
COPY ./client-admin /usr/share/nginx/html/admin/
COPY ./er-model /usr/share/nginx/html/er-model/



