function showMenu() {
  let links = document.getElementById('links');
  console.log(links);
  if (links.style.display === 'block') {
  links.style.display = 'none';
} else {
  links.style.display = 'block';
}
}
