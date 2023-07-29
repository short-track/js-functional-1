function* Cut(num, callback) {
	let i = 0;
	while(true) {
		yield i++;
		if (i === num - 1) {
			return callback()
		}
	}
}

var cut = Cut(3, function() {
  console.log("3 timelines are finished");
});
  
cut.next();
cut.next();


// 발제문 1