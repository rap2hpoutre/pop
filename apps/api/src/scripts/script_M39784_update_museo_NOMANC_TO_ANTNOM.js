
let notices = db.museo.find({}).noCursorTimeout();
let noticeCount = db.museo.count();
print(noticeCount);
notices.forEach(aRow => {
	//Update field NOMANC to AUTNOM
	db.museo.update(
		{ REF : aRow.REF},
		{
			$rename : {
				'NOMANC' : 'AUTNOM'
            }
		}
	)
	
	noticeCount--;
	print(nbreNotices + " notices restantes");
})