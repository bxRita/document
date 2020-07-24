/*
 * FilePath: \HashTable.js
 * Project: demo
 * CreatedAt: 2020-07-24 11:05:07
 * CreatedBy: bx
 * Copyright: (c) 2020
 * Task: #1
 * Write a description of the code here.
 * 散列表
 */

class HashTable {
  constructor() {
    this.table = [];
  }
  //散列函数
  loseHashCode(key) {
    var hash = 0;
    //从ASCII表中查到的ASCII值加到hash中
    for (var i = 0; i < key.length; i++) {
      hash += key.charCodeAt(i);
    }
    //为了得到比较小的数值，我们会用hash和任意数除余
    return hash % 37;
  }
  //向散列表增加一个新的项
  put(key, value) {
    var position = this.loseHashCode(key);
    console.log(position + '-' + key);
    this.table[position] = value;
  }
  //根据键从散列表删除值
  remove(key) {
    this.table[this.loseHashCode(key)] = undefined;
  }
  //返回根据键值检索到的特定的值
  get(key) {
    console.log(this.table[this.loseHashCode(key)])
  }
  print() {
    for (var i = 0; i < this.table.length; ++i) {
      if (this.table[i] !== undefined) {
        console.log(i + ':' + this.table[i]);
      }
    }
  }
}
var hash = new HashTable();
hash.put('Gandalf', 'gandalf@email.com');
hash.put('John', 'johnsnow@email.com');
hash.put('Tyrion', 'tyrion@email.com');
hash.remove('Gandalf')
hash.get('Gandalf')
hash.get('Tyrion')
hash.print()