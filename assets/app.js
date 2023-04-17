console.log("Esto funciona!")

const navLinks = document.querySelectorAll('nav ul li a');
const sections = document.querySelectorAll('section');

navLinks.forEach((link) => {
	link.addEventListener('click', (e) => {
		e.preventDefault();
		const targetId = e.target.getAttribute('href');
		const targetSection = document.querySelector(targetId);
		targetSection.scrollIntoView({ behavior: 'smooth' });
	});
});

window.addEventListener('scroll', () => {
	sections.forEach((section) => {
		const top = section.offsetTop
	}
	