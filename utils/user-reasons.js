export default (reasons) => {
  const reasonsArray = Object.keys(reasons).filter(reason => reasons[reason].checked);

  return {
    array: reasonsArray,
    length: reasonsArray.length
  };
}