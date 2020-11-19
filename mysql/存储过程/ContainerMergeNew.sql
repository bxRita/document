CREATE DEFINER=`root`@`%` PROCEDURE `ContainerMergeNew`(IN materialCode mediumtext character set utf8,
                                                IN materialName mediumtext character set utf8,
                                                IN containerSeq int,
                                                In containerNum mediumtext character set utf8,
                                                In containerStatus char(30),
                                                In containerTare decimal(65),
                                                In newIdentifier mediumtext character set utf8,
                                                In containerTareUnit mediumtext character set utf8,
                                                In theoreticalWeight decimal(65),
                                                In remainingWeight decimal(65),
                                                In receiptContainerNum int,
                                                In sampleStatus mediumtext character set utf8,
                                                In containerType mediumtext character set utf8,
																								In containerTypeCode mediumtext character set utf8,
                                                In newLotId mediumtext character set utf8,
                                                In newMfgLotNo mediumtext character set utf8,
                                                In newPalletCode mediumtext character set utf8,
                                                In newPalletEmpCode mediumtext character set utf8,
                                                In newPalletUnit mediumtext character set utf8,
                                                In newPalletStatus mediumtext character set utf8,
                                                In curActionId mediumtext character set utf8,
                                                In historyMessage mediumtext character set utf8,
																								In mergedContainerIds mediumtext character set utf8, # 被合并容器id
																								In splitStr mediumtext character set utf8 #拆分字符串
                                                )
begin
	 # 查询新容器所在批次信息
   SELECT lotNo, status, expiryDate,containerCount into @newLotNo, @newLotStatus, @newLotExpiryDate,@newLotContainerCount from Lot WHERE id = newLotId;
	 # 查询新容器所在库位信息
	 SELECT id, isMassStorage, remainCapacity, entityNum into @newPalletEmpId, @newEmpIsMassStorage, @newEmpRemainCapacity, @newEmpEntityNum from `Emplacement` WHERE code = newPalletEmpCode;
	 
    # 1. 创建合并后新容器所在托盘
    SET @md5_uuid_short = MD5(uuid_short());
    # 截取字符，最大不超过字段定义的25
    SET @palletId = if(LENGTH(@md5_uuid_short) >= 25, substring(@md5_uuid_short, -25), (@md5_uuid_short));

    INSERT INTO `Pallet`(`id`, `createdAt`, `updatedAt`, `code`, `materialCode`, `status`,
                                 `originalEmplacement`, `targetEmplacement`, `palletTare`,
                                 `tareUnit`, `theoreticalQuantity`, `unit`, `palletQuantity`,
                                 `emplacement`, `lot`, `isFull`, `palletSeq`, `materialName`,
                                 `palletType`, `isCommonPallet`)
    Values (@palletId, NOW(), NOW(), newPalletCode, materialCode, newPalletStatus, newPalletEmpCode, newPalletEmpCode,
            containerTare, containerTareUnit, theoreticalWeight, newPalletUnit, 1, @newPalletEmpId, newLotId, true,
            1, materialName, containerType, false);

    # 2. 创建合并后新容器
    SET @container_uuid_short = MD5(uuid_short());
    # 截取字符，最大不超过字段定义的25
    SET @containerId = if(LENGTH(@container_uuid_short) >= 25, substring(@container_uuid_short, -25), (@container_uuid_short));

    INSERT INTO `Container`(`id`, `createdAt`, `updatedAt`, `materialCode`, `containerNum`,
                                            `containerStatus`, `identifier`, `containerTare`, `containerTareUnit`,
                                            `theoreticalWeight`, `remainingWeight`, `sampleStatus`,
                                            `sampleCount`, `isRejected`, `isContainerOpen`,
                                            `expirationDate`, `pallet`, `containerType`, `lot`, `isFinishedContainer`,
                                            `receiptContainerNum`, `receiptContainerCount`, `materialName`,
                                            `containerSeq`,`receptVersion`, `declareVersion`)
    values (@containerId, NOW(), NOW(), materialCode, containerNum, containerStatus, newIdentifier, containerTare,
            containerTareUnit, theoreticalWeight, remainingWeight, sampleStatus, 0, false, false, @newLotExpiryDate, @palletId,
            containerType, newLotId, false, receiptContainerNum, @newLotContainerCount + 1, materialName, containerSeq, 0, 0);

 # 3. 新创建容器的批次历史
    SET @new_history_uuid_short = MD5(uuid_short());
    # 截取字符，最大不超过字段定义的25
    SET @newHistoryId = if(LENGTH(@new_history_uuid_short) >= 25, substring(@new_history_uuid_short, -25), (@new_history_uuid_short));
    INSERT INTO `LotHistories`(`id`, `createdAt`, `updatedAt`, `actionId`, `palletCode`, `palletStatus`, `lot`, `mfgLot`,`status`,
                                               `materialCode`, `materialName`, `qty`, `unit`, `message`, `identifier`)
                    VALUES (@newHistoryId, NOW(), NOW(), curActionId, newPalletCode, newPalletStatus,
                            @newLotNo, newMfgLotNo, @newLotStatus, materialCode, materialName, remainingWeight,
                            newPalletUnit, historyMessage, newIdentifier);

    # 4. 调整批次容器数量
    UPDATE `Lot` SET containerCount = @newLotContainerCount+1 where id = newLotId;

		begin  
				# 5. 调整库位剩余量
				select coefficient into @newCoefficient from ContainerType WHERE code = containerTypeCode;		
		
				IF @newEmpIsMassStorage = 1 THEN 
					UPDATE `Emplacement` SET entityNum = @newEmpEntityNum + 1 where id = @newPalletEmpId;
				ELSE
					UPDATE `Emplacement` SET entityNum = @newEmpEntityNum + 1 , remainCapacity = @newEmpRemainCapacity + @newCoefficient where id = @newPalletEmpId;
				END IF;
			end;			
		
			begin

				# 6. 调整目标库位的库存数量																						
				SELECT id, totalQuantity into @newContainerInventoryId, @newLotInvTotalQuantity from Inventory where materialCode = materialCode and emplacementCode = @newPalletEmpId and lot = newLotId;
				IF @newContainerInventoryId is not null THEN
						UPDATE `Inventory` SET totalQuantity = @newLotInvTotalQuantity + remainingWeight  where id = @newContainerInventoryId;
				ELSE
						SET @new_Inv_uuid_short = MD5(uuid_short());
						# 截取字符，最大不超过字段定义的25
						SET @newInvId = if(LENGTH(@new_Inv_uuid_short) >= 25, substring(@new_Inv_uuid_short, -25), (@new_Inv_uuid_short));

						INSERT INTO `Inventory`(`id`, `createdAt`, `updatedAt`, `materialCode`, `materialName`, `lot`, `emplacementCode`,
																		`totalQuantity`, `reserveQuantity`)
						VALUES (@newInvId, NOW(), NOW(), materialCode, materialName, newLotId, @newPalletEmpId, remainingWeight, 0);
				END IF;
		
			end;	

    # 7. 被合并容器的剩余量和库存数量 TODO
		call ContainerMergeOther(mergedContainerIds, splitStr, curActionId, historyMessage);
		
		# 8. 结束
		
commit;

end