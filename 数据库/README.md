## Mysql存储过程查询结果赋值到变量的方法

### 1. Mysql存储过程查询结果赋值到变量的方法   
把查询结果赋值到变量，大部分情况下使用游标来完成，但是如果明确知道查询结果只有一行（例如统计记录的数量，某个字段求和等），其实可以使用set或into的方式来实现赋值。示例代码：
```sql
drop table if exists test_tbl;
create table test_tbl (name varchar(20), status int(2));
insert into test_tbl values('abc', 1),('edf', 2),('xyz', 3);
 
drop procedure IF EXISTS pro_test_3;
delimiter //
create procedure pro_test_3()
begin
--  方式 1
    DECLARE cnt INT DEFAULT 0;
    select count(*) into cnt from test_tbl;
    select cnt;
 
--  方式 2
    set @cnt = (select count(*) from test_tbl);
    select @cnt;

--  方式 3
    select count(*) into @cnt1 from test_tbl;
    select @cnt1;

 

--  多个列的情况下似乎只能用 into 方式

    select max(status), avg(status) into @max, @avg from test_tbl;

    select @max, @avg;

end

//

delimiter ;
 
call pro_test_3();
```

### 2. 类似数组字符串输入，对字符串循环处理  
[案例](./存储过程/StrSplitFun.sql)：
```sql
CREATE DEFINER=`root`@`%` PROCEDURE `StrSplitFun`(In s_str mediumtext character set utf8, 
																												In s_split mediumtext character set utf8)
BEGIN
  #Routine body goes here...
	
	set @i = length(s_str) - length(replace(s_str,s_split,''));  -- 算出分隔符的总数
	set @left_str = s_str;
	
  # 循环开始
	while @i >= 0 
		do
			set @sub_str = substr(@left_str,1,instr(@left_str,s_split)-1);            -- 得到分隔符前面的字符串
			set @left_str = substr(@left_str,length(@sub_str)+length(s_split)+1);     -- 得到分隔符后面的字符串
			
			if @sub_str is null or @sub_str = '' then				
				set @n = trim(@left_str);
			ELSE
				set @n = trim(@sub_str);
			END IF;
			
			SELECT @n;
			# 业务相关开始

      # 业务相关结束
			set @i = @i - 1; 
			
	END while;
	# 循环结束
	commit;
	
END
```
调用：
```sql
set @s_str = '43aff4ccb1e37ccb526857fd5,9888520f125431934c1e660b0,a0834874d6303a04313c1050b'; # 待处理的字符串id
set @s_split = ','; # 拆分字符
call StrSplitFun(@s_str,@s_split);
```