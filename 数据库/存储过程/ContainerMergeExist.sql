CREATE DEFINER=`root`@`%` PROCEDURE `ContainerMergeExist`(In targetIdentifier mediumtext character set utf8,
                                                In newCount decimal(65),
																								In targetPalletIsFull int,
                                                In newMfgLotNo mediumtext character set utf8,
                                                In curActionId mediumtext character set utf8,
                                                In historyMessage mediumtext character set utf8,
																								In mergedContainerIds mediumtext character set utf8, # 被合并容器id
																								In splitStr mediumtext character set utf8 #拆分字符串
                                                )
begin
	 # 查询目标容器的基本信息
	 SELECT materialCode,materialName,pallet,lot,remainingWeight into @materialCode,@materialName,@targetPalletId,@targetLotId,@curRemainingWeight from Container where identifier = targetIdentifier;
	 SELECT @materialCode,@materialName,@targetPalletId,@targetLotId,@curRemainingWeight;
	 # 查询目标容器所在托盘基本信息
	 SELECT code,status,emplacement,unit into @targetPalletCode,@targetPalletStatus,@targetEmpId, @stockUnit from Pallet WHERE id = @targetPalletId;
	 # 查询新容器所在批次信息
   SELECT lotNo, status into @targetLotNo, @newLotStatus from Lot WHERE id = @targetLotId and materialCode = @materialCode;
	 # 查询新容器所在库位信息
	 SELECT id, isMassStorage, remainCapacity, entityNum into @newPalletEmpId, @newEmpIsMassStorage, @newEmpRemainCapacity, @newEmpEntityNum from `Emplacement` WHERE id = @targetEmpId;
	 
		# 1. 更新目标容器的剩余量:
		update Container set remainingWeight = @curRemainingWeight+newCount WHERE identifier = targetIdentifier;
    # 2. 目标容器的批次历史
    SET @new_history_uuid_short = MD5(uuid_short());
    # 截取字符，最大不超过字段定义的25
    SET @newHistoryId = if(LENGTH(@new_history_uuid_short) >= 25, substring(@new_history_uuid_short, -25), (@new_history_uuid_short));
    INSERT INTO `LotHistories`(`id`, `createdAt`, `updatedAt`, `actionId`, `palletCode`, `palletStatus`, `lot`, `mfgLot`,`status`,
                                               `materialCode`, `materialName`, `qty`, `unit`, `message`, `identifier`)
                    VALUES (@newHistoryId, NOW(), NOW(), curActionId, @targetPalletCode, @targetPalletStatus,
                            @targetLotNo, newMfgLotNo, @newLotStatus, @materialCode, @materialName, newCount,
                            @stockUnit, historyMessage, targetIdentifier);
		# 3. 目标容器所在托盘的满装状态 TODO:
		update Pallet set isFull = targetPalletIsFull WHERE id = @targetPalletId;
		# 4. 调整目标库位的库存数量		
		SELECT id, totalQuantity into @newContainerInventoryId, @newLotInvTotalQuantity from Inventory where materialCode = @materialCode and emplacementCode = @targetEmpId and lot = @targetLotId;
		IF @newContainerInventoryId is not null THEN
				UPDATE `Inventory` SET totalQuantity = @newLotInvTotalQuantity + newCount  where id = @newContainerInventoryId;
		ELSE
				SET @new_Inv_uuid_short = MD5(uuid_short());
				# 截取字符，最大不超过字段定义的25
				SET @newInvId = if(LENGTH(@new_Inv_uuid_short) >= 25, substring(@new_Inv_uuid_short, -25), (@new_Inv_uuid_short));

				INSERT INTO `Inventory`(`id`, `createdAt`, `updatedAt`, `materialCode`, `materialName`, `lot`, `emplacementCode`,
																`totalQuantity`, `reserveQuantity`)
				VALUES (@newInvId, NOW(), NOW(), @materialCode, @materialName, @targetLotId, @targetEmpId, newCount, 0);
		END IF;	
	

    # 5. 被合并容器的剩余量和库存数量 TODO
		call ContainerMergeOther(mergedContainerIds, splitStr, curActionId, historyMessage);		
		
		# 6. 结束
		
commit;

end