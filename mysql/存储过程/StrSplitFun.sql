CREATE DEFINER=`root`@`%` PROCEDURE `StrSplitFun`(In s_str mediumtext character set utf8, 
																												In s_split mediumtext character set utf8)
BEGIN
  #Routine body goes here...
	
	set @i = length(s_str) - length(replace(s_str,s_split,''));  -- 算出分隔符的总数
	set @left_str = s_str;
	

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
			
			set @i = @i - 1; 
			
	END while;
	
	commit;
	
END