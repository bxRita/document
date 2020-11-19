# 1. 合并到新容器
set @materialCode = 'bx01';
set @materialName = 'bx01';
set @containerSeq = 16;
set @containerNum = '0016';
set @containerStatus = 'QUARANTINE';
set @containerTare = 0.1;
set @newIdentifier = 'RL00002060 0016';
set @containerTareUnit = 'kg';
set @theoreticalWeight = 10.0;
set @remainingWeight = 10.0;
set @receiptContainerNum = 16;
set @sampleStatus = 'SAMPLED';
set @containerType = 'ck3r2hjcyp1gi08025u07qxkl';
set @containerTypeCode = 'C1';
set @newLotId = '1';
set @newMfgLotNo = '';
set @newPalletCode = 'C0019674';
set @newPalletEmpCode = 'RQ001';
set @newPalletUnit = 'kg';
set @newPalletStatus = 'S';
set @curActionId = 'ckexlo7g60tzv0889zl5uulp5';
set @historyMessage = '容器合并';
set @mergedContainerIds = '43aff4ccb1e37ccb526857fd5,91f8eda8fe910a7286e81d5d1,9888520f125431934c1e660b0,a0834874d6303a04313c1050b';
set @splitStr = ',';
call ContainerMergeNew(
	@materialCode,
	@materialName,
	@containerSeq,
	@containerNum,
	@containerStatus,
	@containerTare,
	@newIdentifier,
	@containerTareUnit,
	@theoreticalWeight,
	@remainingWeight,
	@receiptContainerNum,
	@sampleStatus,
	@containerType,
	@containerTypeCode,
	@newLotId,
	@newMfgLotNo,
	@newPalletCode,
	@newPalletEmpCode,
	@newPalletUnit,
	@newPalletStatus,
	@curActionId,
	@historyMessage,
	@mergedContainerIds,
	@splitStr
);

# 2. 合并到已存在容器
set @targetIdentifier = 'RL00002060 0010';
set @newCount = 1;
set @targetPalletIsFull = 0;
set @newMfgLotNo='';
set @curActionId='exist-action-id';
set @historyMessage = "容器合并";
set @mergedContainerIds='91f8eda8fe910a7286e81d5d1,9888520f125431934c1e660b0';
set @splitStr=',';
call ContainerMergeExist(@targetIdentifier,@newCount,@targetPalletIsFull,@newMfgLotNo,@curActionId,@historyMessage,@mergedContainerIds,@splitStr);


# 3. 合并到其它容器
set @s_str = '43aff4ccb1e37ccb526857fd5,91f8eda8fe910a7286e81d5d1,9888520f125431934c1e660b0,a0834874d6303a04313c1050b';
set @s_split = ',';
set @curActionId = "action-test";
set @historyMessage = "容器合并";
call ContainerMergeOther(@s_str,@s_split,@curActionId,@historyMessage);
