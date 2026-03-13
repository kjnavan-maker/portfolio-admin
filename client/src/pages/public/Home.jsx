import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

function Home() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [education, setEducation] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [messageSent, setMessageSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const BACKEND_BASE_URL =
    import.meta.env.VITE_IMAGE_BASE_URL ||
    "https://portfolio-admin-i6v3.onrender.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          profileRes,
          projectsRes,
          skillsRes,
          certificatesRes,
          educationRes,
        ] = await Promise.all([
          api.get("/profile"),
          api.get("/projects"),
          api.get("/skills"),
          api.get("/certificates"),
          api.get("/education"),
        ]);

        setProfile(profileRes?.data || null);
        setProjects(Array.isArray(projectsRes?.data) ? projectsRes.data : []);
        setSkills(Array.isArray(skillsRes?.data) ? skillsRes.data : []);
        setCertificates(
          Array.isArray(certificatesRes?.data) ? certificatesRes.data : []
        );
        setEducation(Array.isArray(educationRes?.data) ? educationRes.data : []);
      } catch (error) {
        console.error("Failed to fetch home data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const navbar = document.getElementById("navbar");
    const sections = document.querySelectorAll("section[id]");
    const heroSection = document.querySelector(".hero");
    const heroText = document.querySelector(".hero-text");
    const heroImage = document.querySelector(".hero-image");

    const handleScroll = () => {
      if (window.scrollY > 100) {
        navbar?.classList.add("scrolled");
      } else {
        navbar?.classList.remove("scrolled");
      }

      setShowScrollTop(window.scrollY > 500);

      const scrollY = window.pageYOffset;

      sections.forEach((section) => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute("id");

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });

      const parallaxSpeed = 0.5;
      if (heroSection && scrollY < heroSection.offsetHeight) {
        if (heroText) {
          heroText.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
        }
        if (heroImage) {
          heroImage.style.transform = `translateY(${scrollY * parallaxSpeed * 0.7}px)`;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const animateOnScroll = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("aos-animate");
        }
      });
    }, observerOptions);

    const aosElements = document.querySelectorAll("[data-aos]");
    aosElements.forEach((element) => animateOnScroll.observe(element));

    const skillsSection = document.querySelector(".skills");
    let skillsAnimated = false;

    const animateSkills = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !skillsAnimated) {
          skillsAnimated = true;

          const skillBars = document.querySelectorAll(".skill-progress");
          skillBars.forEach((bar) => {
            const progress = bar.getAttribute("data-progress");
            setTimeout(() => {
              bar.style.width = `${progress}%`;
            }, 200);
          });
        }
      });
    }, observerOptions);

    if (skillsSection) {
      animateSkills.observe(skillsSection);
    }

    const projectCards = document.querySelectorAll(".project-card");
    const cleanupFns = [];

    projectCards.forEach((card) => {
      const handleMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
      };

      const handleMouseLeave = () => {
        card.style.transform =
          "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
      };

      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);

      cleanupFns.push(() => {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      });
    });

    return () => {
      animateOnScroll.disconnect();
      animateSkills.disconnect();
      cleanupFns.forEach((fn) => fn());
    };
  }, [skills, projects, education, certificates]);

  useEffect(() => {
    const heroTitleElement = document.querySelector(".hero-title");
    if (!heroTitleElement) return;

    const text =
      heroTitleElement.dataset.text || heroTitleElement.textContent || "";
    heroTitleElement.textContent = "";
    let index = 0;

    function type() {
      if (index < text.length) {
        heroTitleElement.textContent += text.charAt(index);
        index++;
        setTimeout(type, 100);
      }
    }

    const timer = setTimeout(type, 500);
    return () => clearTimeout(timer);
  }, [profile?.title]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
      setMenuOpen(false);
    }
  };

  const handleContactChange = (e) => {
    setContactForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    try {
      setSending(true);

      await api.post("/messages", contactForm);

      setContactForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setMessageSent(true);

      setTimeout(() => {
        setMessageSent(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to send message", error);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const fullName = profile?.fullName || "Navaneethan Karunashankar";

  const firstName = useMemo(() => {
    return fullName.split(" ")[0] || "Navaneethan";
  }, [fullName]);

  const lastName = useMemo(() => {
    return fullName.split(" ").slice(1).join(" ") || "Karunashankar";
  }, [fullName]);

  const heroTitle = profile?.title || "Software Engineering Student";

  const heroDescription =
    profile?.bio ||
    "Passionate about building efficient software solutions and continuously learning new technologies. Seeking opportunities to gain industry experience and contribute to professional development teams.";

  const aboutTextOne =
    profile?.about ||
    "Motivated Software Engineering student with strong academic knowledge and practical project experience in web development, programming, and UI/UX design. I'm passionate about building efficient software solutions and continuously learning new technologies.";

  const aboutTextTwo =
    profile?.aboutExtra ||
    "Currently pursuing my Bachelor's degree in Software Engineering at ESU - Jaffna, I have completed my Higher National Diploma and gained hands-on experience through various projects including e-commerce platforms, UI/UX design, and data analysis applications.";

  const resolvedProfileImage =
    profile?.image ||
    profile?.profileImage ||
    profile?.avatar ||
    profile?.photo ||
    "";

  const finalProfileImage =
    !imgError && resolvedProfileImage
      ? resolvedProfileImage.startsWith("http")
        ? resolvedProfileImage
        : `${BACKEND_BASE_URL}${resolvedProfileImage}`
      : "/images/navaneethan.jpeg";

  const normalizeSkillProgress = (skill) => {
    if (typeof skill?.progress === "number") return skill.progress;
    if (typeof skill?.percentage === "number") return skill.percentage;
    if (!Number.isNaN(Number(skill?.level))) return Number(skill.level);

    const level = String(skill?.level || "").toLowerCase();
    if (level.includes("expert")) return 95;
    if (level.includes("advanced")) return 85;
    if (level.includes("intermediate")) return 70;
    if (level.includes("beginner")) return 50;

    return 80;
  };

  const technicalSkills =
    skills.length > 0
      ? skills.filter((skill) => {
          const category = String(skill?.category || "").toLowerCase();
          return !category || category.includes("technical");
        })
      : [
          { name: "HTML & CSS", level: 90, icon: "fab fa-html5" },
          { name: "JavaScript", level: 85, icon: "fab fa-js" },
          { name: "PHP", level: 80, icon: "fab fa-php" },
          { name: "MySQL", level: 80, icon: "fas fa-database" },
          { name: "Java", level: 85, icon: "fab fa-java" },
          { name: "Python", level: 85, icon: "fab fa-python" },
          { name: "Figma (UI/UX)", level: 80, icon: "fab fa-figma" },
          {
            name: "Data Structures & Algorithms",
            level: 85,
            icon: "fas fa-project-diagram",
          },
        ];

  const softSkills =
    skills.filter((skill) =>
      String(skill?.category || "").toLowerCase().includes("soft")
    ).length > 0
      ? skills.filter((skill) =>
          String(skill?.category || "").toLowerCase().includes("soft")
        )
      : [
          {
            name: "Communication & Interpersonal Skills",
            icon: "fas fa-comments",
          },
          { name: "Team Collaboration", icon: "fas fa-users" },
          { name: "Time Management", icon: "fas fa-clock" },
          { name: "Adaptability", icon: "fas fa-sync-alt" },
          { name: "Analytical & Problem-Solving", icon: "fas fa-brain" },
          { name: "Quick Learning Ability", icon: "fas fa-book-reader" },
        ];

  const displayProjects =
    projects.length > 0
      ? projects
      : [
          {
            title: "Velvet Vogue",
            subtitle: "E-Commerce Website",
            description:
              "Developed a dynamic e-commerce web application with product filtering and database integration. Implemented backend functionality using PHP and MySQL for seamless data management.",
            technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
            year: "2024 - 2026",
            icon: "fas fa-shopping-cart",
          },
          {
            title: "Eco-Tourism Cloud Platform (ETCP)",
            subtitle: "UI/UX Design",
            description:
              "Created wireframes and interactive prototypes using Figma with user-centered design principles. Focused on creating an intuitive experience for eco-tourism enthusiasts.",
            technologies: ["Figma", "UI/UX", "Wireframing", "Prototyping"],
            year: "2024 - 2026",
            icon: "fas fa-palette",
          },
          {
            title: "Healthcare Appointment System",
            subtitle: "DSA Project",
            description:
              "Built a Java-based solution for managing healthcare workflows using optimized data structures and algorithms. Efficiently handles patient appointments and medical records.",
            technologies: ["Java", "Data Structures", "Algorithms", "Healthcare"],
            year: "2024 - 2026",
            icon: "fas fa-hospital",
          },
          {
            title: "Dream Book Shop",
            subtitle: "CLI Data Analysis Application",
            description:
              "Developed a Python command-line application using CSV datasets to generate textual summaries and business insights for book inventory management.",
            technologies: ["Python", "CSV", "Data Analysis", "CLI"],
            year: "2024 - 2026",
            icon: "fas fa-book",
          },
        ];

  const displayEducation =
    education.length > 0
      ? education
      : [
          {
            title: "Bachelor of Science (Hons) in Software Engineering",
            institution: "ESU - Jaffna",
            status: "Currently Studying",
            type: "ongoing",
            icon: "fas fa-graduation-cap",
          },
          {
            title: "Higher National Diploma (HND) in Software Engineering",
            institution: "ESU - Jaffna",
            status: "Completed - February 2026",
            type: "completed",
            icon: "fas fa-certificate",
          },
          {
            title: "G.C.E Advanced Level (Bio Stream)",
            status: "Completed - 2020",
            type: "completed",
            icon: "fas fa-school",
          },
          {
            title: "G.C.E Ordinary Level",
            status: "Completed - 2017",
            type: "completed",
            icon: "fas fa-school",
          },
        ];

  const displayCertificates =
    certificates.length > 0
      ? certificates
      : [
          {
            title: "Python for Problem Solving",
            issuer: "Department of Computer Science",
            organization: "University of Jaffna",
            icon: "fab fa-python",
          },
          {
            title: "Advanced Web Development",
            issuer: "Department of Computer Science",
            organization: "University of Jaffna",
            icon: "fas fa-globe",
          },
        ];

  return (
    <div>
      <nav className="navbar" id="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <button
              type="button"
              onClick={() => scrollToSection("home")}
              className="nav-logo-button"
            >
              KJ<span className="accent">.</span>
            </button>
          </div>

          <ul className={`nav-menu ${menuOpen ? "active" : ""}`} id="nav-menu">
            {["home", "about", "skills", "projects", "education", "contact"].map(
              (item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(item)}
                    className={`nav-link ${activeSection === item ? "active" : ""}`}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </button>
                </li>
              )
            )}
          </ul>

          <div
            className="nav-toggle"
            id="nav-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`}></i>
          </div>
        </div>
      </nav>

      <section className="hero" id="home">
        <div className="hero-background">
          <div className="hero-particles"></div>
        </div>

        <div className="container">
          <div className="hero-content">
            <div className="hero-text" data-aos="fade-right">
              <p className="hero-greeting">Hi, I&apos;m</p>
              <h1 className="hero-name">
                {firstName}
                <br />
                <span className="accent">{lastName}</span>
              </h1>

              <h2 className="hero-title" data-text={heroTitle}>
                {heroTitle}
              </h2>

              <p className="hero-description">{heroDescription}</p>

              <div className="hero-buttons">
                <button
                  type="button"
                  onClick={() => scrollToSection("contact")}
                  className="btn btn-primary"
                >
                  <i className="fas fa-envelope"></i> Contact Me
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("about")}
                  className="btn btn-secondary"
                >
                  <i className="fas fa-user"></i> Learn More
                </button>
              </div>

              <div className="hero-social">
                <a
                  href={
                    profile?.linkedin ||
                    "https://linkedin.com/in/navaneethan-karunashankar"
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="social-link"
                >
                  <i className="fab fa-linkedin"></i>
                </a>

                <a
                  href={`mailto:${profile?.email || "kjnavaneethan019@gmail.com"}`}
                  className="social-link"
                >
                  <i className="fas fa-envelope"></i>
                </a>

                <a
                  href={`tel:${profile?.phone || "+94764304068"}`}
                  className="social-link"
                >
                  <i className="fas fa-phone"></i>
                </a>
              </div>
            </div>

            <div className="hero-image" data-aos="fade-left">
              <div className="hero-avatar">
                <div className="avatar-circle">
                  <img
                    src={finalProfileImage}
                    alt={fullName}
                    onError={() => setImgError(true)}
                  />
                </div>
                <div className="avatar-glow"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <button type="button" onClick={() => scrollToSection("about")}>
            <i className="fas fa-chevron-down"></i>
          </button>
        </div>
      </section>

      <section className="about" id="about">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag">Get To Know</span>
            <h2 className="section-title">About Me</h2>
          </div>

          <div className="about-content">
            <div className="about-image" data-aos="fade-right">
  {profile?.showAboutImage && finalProfileImage ? (
    <div className="about-avatar about-avatar-image">
      <img
        src={finalProfileImage}
        alt={fullName}
        onError={() => setImgError(true)}
      />
    </div>
  ) : (
    <div className="about-avatar">
      <i className="fas fa-user-graduate"></i>
    </div>
  )}
</div>

            <div className="about-text" data-aos="fade-left">
              <h3>Hello! I&apos;m {firstName}</h3>
              <p className="about-description">{aboutTextOne}</p>
              <p className="about-description">{aboutTextTwo}</p>

              <div className="about-info">
                <div className="info-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{profile?.location || "Jaffna, Sri Lanka"}</span>
                </div>

                <div className="info-item">
                  <i className="fas fa-envelope"></i>
                  <span>{profile?.email || "kjnavaneethan019@gmail.com"}</span>
                </div>

                <div className="info-item">
                  <i className="fas fa-phone"></i>
                  <span>{profile?.phone || "+94 764304068"}</span>
                </div>

                <div className="info-item">
                  <i className="fas fa-language"></i>
                  <span>{profile?.languages || "Tamil, English"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="skills" id="skills">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag">What I Know</span>
            <h2 className="section-title">My Skills</h2>
          </div>

          <div className="skills-content">
            <div className="skills-category" data-aos="fade-up">
              <h3 className="category-title">
                <i className="fas fa-code"></i> Technical Skills
              </h3>

              <div className="skills-grid">
                {technicalSkills.map((skill, index) => (
                  <div className="skill-item" key={skill._id || skill.name || index}>
                    <div className="skill-icon">
                      <i className={skill.icon || "fas fa-code"}></i>
                    </div>

                    <div className="skill-info">
                      <span className="skill-name">{skill.name}</span>
                      <div className="skill-bar">
                        <div
                          className="skill-progress"
                          data-progress={normalizeSkillProgress(skill)}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="skills-category" data-aos="fade-up" data-aos-delay="100">
              <h3 className="category-title">
                <i className="fas fa-lightbulb"></i> Soft Skills
              </h3>

              <div className="soft-skills-grid">
                {softSkills.map((skill, index) => (
                  <div
                    className="soft-skill-badge"
                    key={skill._id || skill.name || index}
                  >
                    <i className={skill.icon || "fas fa-lightbulb"}></i>
                    <span>{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="projects" id="projects">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag">My Work</span>
            <h2 className="section-title">Featured Projects</h2>
          </div>

          <div className="projects-grid">
            {displayProjects.map((project, index) => (
              <div
                className="project-card"
                data-aos="fade-up"
                data-aos-delay={index * 100}
                key={project._id || project.title || index}
              >
                <div className="project-header">
                  <div className="project-icon">
                    <i className={project.icon || "fas fa-code"}></i>
                  </div>
                  <span className="project-year">
                    {project.year || project.duration || "2024 - 2026"}
                  </span>
                </div>

                <h3 className="project-title">{project.title}</h3>
                <p className="project-subtitle">
                  {project.subtitle || project.category}
                </p>
                <p className="project-description">{project.description}</p>

                <div className="project-tags">
                  {(project.technologies || project.tags || []).map((tech, i) => (
                    <span className="tag" key={i}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {displayProjects.length === 0 && (
              <p className="empty-text">No projects found.</p>
            )}
          </div>
        </div>
      </section>

      <section className="education" id="education">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag">Academic Journey</span>
            <h2 className="section-title">Education & Certifications</h2>
          </div>

          <div className="education-content">
            <div className="education-timeline">
              {displayEducation.map((item, index) => (
                <div
                  className="timeline-item"
                  data-aos="fade-right"
                  data-aos-delay={index * 100}
                  key={item._id || item.title || index}
                >
                  <div className="timeline-icon">
                    <i className={item.icon || "fas fa-graduation-cap"}></i>
                  </div>

                  <div className="timeline-content">
                    <span
                      className={`timeline-status ${
                        item.type === "ongoing" ? "ongoing" : "completed"
                      }`}
                    >
                      {item.status || item.year}
                    </span>

                    <h3>{item.title}</h3>
                    {item.institution && (
                      <p className="timeline-institution">{item.institution}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="certifications" data-aos="fade-left">
              <h3 className="certifications-title">
                <i className="fas fa-award"></i> Professional Certifications
              </h3>

              <div className="certification-cards">
                {displayCertificates.map((certificate, index) => (
                  <div
                    className="certification-card"
                    key={certificate._id || certificate.title || index}
                  >
                    <div className="cert-icon">
                      <i className={certificate.icon || "fas fa-award"}></i>
                    </div>

                    <h4>{certificate.title}</h4>
                    <p>
                      {certificate.issuer}
                      {certificate.organization ? <br /> : null}
                      {certificate.organization}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag">Get In Touch</span>
            <h2 className="section-title">Contact Me</h2>
            <p className="section-description">
              Feel free to reach out for opportunities, collaborations, or just
              to say hello!
            </p>
          </div>

          <div className="contact-content">
            <div className="contact-info" data-aos="fade-right">
              <div className="contact-card">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <h3>Email</h3>
                <a href={`mailto:${profile?.email || "kjnavaneethan019@gmail.com"}`}>
                  {profile?.email || "kjnavaneethan019@gmail.com"}
                </a>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <h3>Phone</h3>
                <a href={`tel:${profile?.phone || "+94764304068"}`}>
                  {profile?.phone || "+94 764304068"}
                </a>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h3>Location</h3>
                <p>{profile?.location || "Jaffna, Sri Lanka"}</p>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <i className="fab fa-linkedin"></i>
                </div>
                <h3>LinkedIn</h3>
                <a
                  href={
                    profile?.linkedin ||
                    "https://linkedin.com/in/navaneethan-karunashankar"
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  Connect with me
                </a>
              </div>
            </div>

            <div className="contact-form-wrapper" data-aos="fade-left">
              {!messageSent ? (
                <form
                  className="contact-form"
                  id="contact-form"
                  onSubmit={handleContactSubmit}
                >
                  <div className="form-group">
                    <label htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleContactChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={contactForm.message}
                      onChange={handleContactChange}
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={sending}
                  >
                    <i className="fas fa-paper-plane"></i>{" "}
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                </form>
              ) : null}

              <div
                className={`form-success ${messageSent ? "show" : ""}`}
                id="form-success"
              >
                <i className="fas fa-check-circle"></i>
                <p>Thank you! Your message has been sent successfully.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p>
              &copy; {new Date().getFullYear()} {fullName}. All Rights Reserved.
            </p>

            <div className="footer-social">
              <a
                href={
                  profile?.linkedin ||
                  "https://linkedin.com/in/navaneethan-karunashankar"
                }
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-linkedin"></i>
              </a>

              <a href={`mailto:${profile?.email || "kjnavaneethan019@gmail.com"}`}>
                <i className="fas fa-envelope"></i>
              </a>

              <a href={`tel:${profile?.phone || "+94764304068"}`}>
                <i className="fas fa-phone"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <button
        className={`scroll-top ${showScrollTop ? "show" : ""}`}
        id="scroll-top"
        onClick={scrollToTop}
      >
        <i className="fas fa-arrow-up"></i>
      </button>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-pill">Loading...</div>
        </div>
      )}
    </div>
  );
}

export default Home;