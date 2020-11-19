CREATE DEFINER=`root`@`%` PROCEDURE `ContainerMergeOther`(In mergedContainerIds mediumtext character set utf8, 
																												In splitStr mediumtext character set utf8,
																												In curActionId mediumtext character set utf8,
																												In historyMessage mediumtext character set utf8
																												)
begin
	set @i = length(mergedContainerIds) - length(replace(mergedContainerIds,splitStr,''));  -- 算出分隔符的总数
	set @containerid_str = mergedContainerIds;
	# 循环开始
	while @i >= 0 
		do
			set @sub_str = substr(@containerid_str,1,instr(@containerid_str,splitStr)-1);            -- 得到分隔符前面的字符串
			set @containerid_str = substr(@containerid_str,length(@sub_str)+length(splitStr)+1);     -- 得到分隔符后面的字符串
			
			if @sub_str is null or @sub_str = '' then				
				set @cid = trim(@containerid_str);
			ELSE
				set @cid = trim(@sub_str);
			END IF;
			
      # 业务代码开始
			begin
					if @cid is not null or @cid != '' then
						# 查询该容器的基本信息
						SELECT identifier,pallet,materialCode,lot,remainingWeight,materialName  into @identifier,@palletId, @materialCode, @lotId, @tempRemainingWeight,@materialName from Container where id = @cid;
						# 获取该容器所属托盘的基本信息
						SELECT emplacement, code, status,unit into @emplacementId, @palletCode, @palletStatus,@stockUnit from `Pallet` WHERE id = @palletId;				
						# 查询该库位的库存信息
						SELECT id, totalQuantity into @invId, @invTotalQuantity from Inventory WHERE materialCode = @materialCode and lot = @lotId and emplacementCode = @emplacementId;
						# 查询该容器的批次信息
						SELECT lotNo,status into @lotNo,@lotStatus from `Lot` where id = @lotId;
						# 7.1 更新容器剩余量
						update `Container` set remainingWeight = 0 WHERE id = @cid;
						# 7.2 更新容器所属托盘的满装状态						
						update `Pallet` set isFull = 0 WHERE id = @palletId;
						# 7.3 更新容器库存信息						
						begin			
							if @emplacementId is not null and @invId is not null then
								# 如果库存信息存在 则更新
								update `Inventory` set totalQuantity = @invTotalQuantity - @tempRemainingWeight WHERE id = @invId;
							end if;
						end;
						# 7.4 记录容器更新的批次历史
						SET @new_history_uuid_short = MD5(uuid_short());
						# 截取字符，最大不超过字段定义的25
						SET @newHistoryId = if(LENGTH(@new_history_uuid_short) >= 25, substring(@new_history_uuid_short, -25), (@new_history_uuid_short));
						INSERT INTO `LotHistories`(`id`, `createdAt`, `updatedAt`, `actionId`, `palletCode`, `palletStatus`, `mfgLot`,`status`,
																											 `materialCode`, `materialName`, `qty`, `unit`, `message`, `identifier`)
														VALUES (@newHistoryId, NOW(), NOW(), curActionId, @palletCode, @palletStatus,
																		@lotNo, @lotStatus, @materialCode, @materialName, 0,
																		@stockUnit, historyMessage, @identifier);
					end if;
			end;
			# 业务代码结束
			
			set @i = @i - 1; 
			
	END while;
	# 循环结束
end