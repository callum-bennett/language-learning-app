class Word {
  constructor(id, name, categoryIds = [], translation = "", gender = "") {
    this.id = id;
    this.categoryIds = categoryIds;
    this.name = name;
    this.translation = translation;
    this.gender = gender;
  }
}

export default Word;
