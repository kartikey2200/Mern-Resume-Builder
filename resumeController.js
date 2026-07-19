const Resume = require('../models/Resume');

exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createResume = async (req, res) => {
  try {
    const resume = await Resume.create({
      user: req.user._id,
      title: req.body.title || 'Untitled Resume',
      template: req.body.template || 'classic',
      personalInfo: {
        fullName: req.user.name || '',
        email: req.user.email || '',
      },
    });
    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updated = await Resume.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await Resume.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.generatePDF = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${resume.title || 'resume'}.pdf"`);
    doc.pipe(res);

    const colors = getTemplateColors(resume.template);

    if (resume.template === 'modern' || resume.template === 'creative') {
      doc.rect(0, 0, 160, doc.page.height).fill(colors.primary);
      doc.fillColor('#ffffff').fontSize(14).font('Helvetica-Bold');
      doc.text(resume.personalInfo.fullName || 'Your Name', 20, 40, { width: 120 });

      if (resume.personalInfo.email) {
        doc.fontSize(8).font('Helvetica').text(resume.personalInfo.email, 20, 65, { width: 120 });
      }
      if (resume.personalInfo.phone) {
        doc.text(resume.personalInfo.phone, 20, 78, { width: 120 });
      }
      if (resume.personalInfo.location) {
        doc.text(resume.personalInfo.location, 20, 91, { width: 120 });
      }

      doc.fillColor(colors.text);
      let y = 40;
      const left = 180;
    } else {
      doc.fontSize(24).font('Helvetica-Bold').fillColor(colors.primary);
      doc.text(resume.personalInfo.fullName || 'Your Name', { align: 'center' });

      const contactParts = [resume.personalInfo.email, resume.personalInfo.phone, resume.personalInfo.location].filter(Boolean);
      if (contactParts.length > 0) {
        doc.moveDown(0.2);
        doc.fontSize(9).font('Helvetica').fillColor(colors.text);
        doc.text(contactParts.join(' | '), { align: 'center' });
      }

      if (resume.personalInfo.linkedin) {
        doc.text(resume.personalInfo.linkedin, { align: 'center' });
      }

      doc.fillColor(colors.text);
    }

    if (resume.personalInfo.summary) {
      doc.moveDown(0.5);
      addSectionHeader(doc, 'Professional Summary', colors);
      doc.fontSize(9).font('Helvetica').fillColor(colors.text);
      doc.text(resume.personalInfo.summary, { lineGap: 2 });
    }

    if (resume.experience && resume.experience.length > 0) {
      doc.moveDown(0.3);
      addSectionHeader(doc, 'Work Experience', colors);
      resume.experience.forEach((exp) => {
        doc.moveDown(0.2);
        doc.fontSize(10).font('Helvetica-Bold').fillColor(colors.primary);
        doc.text(exp.position || 'Position');
        doc.fontSize(9).font('Helvetica').fillColor(colors.text);
        doc.text(`${exp.company || 'Company'}${exp.startDate ? ' | ' + exp.startDate + ' - ' + (exp.endDate || 'Present') : ''}`);
        if (exp.description) {
          doc.moveDown(0.1);
          doc.fontSize(8).text(exp.description, { lineGap: 1 });
        }
      });
    }

    if (resume.education && resume.education.length > 0) {
      doc.moveDown(0.3);
      addSectionHeader(doc, 'Education', colors);
      resume.education.forEach((edu) => {
        doc.moveDown(0.2);
        doc.fontSize(10).font('Helvetica-Bold').fillColor(colors.primary);
        doc.text(edu.degree || 'Degree');
        doc.fontSize(9).font('Helvetica').fillColor(colors.text);
        const eduLine = [edu.institution, edu.fieldOfStudy, edu.startDate && edu.endDate ? edu.startDate + ' - ' + edu.endDate : ''].filter(Boolean).join(' | ');
        doc.text(eduLine);
        if (edu.gpa) {
          doc.text(`GPA: ${edu.gpa}`);
        }
      });
    }

    if (resume.skills && resume.skills.length > 0) {
      doc.moveDown(0.3);
      addSectionHeader(doc, 'Skills', colors);
      const skillNames = resume.skills.map((s) => s.name).filter(Boolean);
      if (skillNames.length > 0) {
        doc.fontSize(9).font('Helvetica').fillColor(colors.text);
        doc.text(skillNames.join(' • '));
      }
    }

    if (resume.projects && resume.projects.length > 0) {
      doc.moveDown(0.3);
      addSectionHeader(doc, 'Projects', colors);
      resume.projects.forEach((proj) => {
        doc.moveDown(0.2);
        doc.fontSize(10).font('Helvetica-Bold').fillColor(colors.primary);
        doc.text(proj.name || 'Project');
        doc.fontSize(9).font('Helvetica').fillColor(colors.text);
        if (proj.description) doc.text(proj.description, { lineGap: 1 });
        if (proj.technologies) doc.text(`Technologies: ${proj.technologies}`);
        if (proj.url) doc.text(proj.url);
      });
    }

    if (resume.certifications && resume.certifications.length > 0) {
      doc.moveDown(0.3);
      addSectionHeader(doc, 'Certifications', colors);
      resume.certifications.forEach((cert) => {
        doc.moveDown(0.2);
        doc.fontSize(9).font('Helvetica-Bold').fillColor(colors.primary);
        doc.text(cert.name || 'Certification');
        doc.fontSize(8).font('Helvetica').fillColor(colors.text);
        const certLine = [cert.issuer, cert.date].filter(Boolean).join(' | ');
        if (certLine) doc.text(certLine);
      });
    }

    if (resume.languages && resume.languages.length > 0) {
      doc.moveDown(0.3);
      addSectionHeader(doc, 'Languages', colors);
      const langList = resume.languages.map((l) => `${l.name} (${l.proficiency})`).filter((l) => l !== ' (Conversational)');
      if (langList.length > 0) {
        doc.fontSize(9).font('Helvetica').fillColor(colors.text);
        doc.text(langList.join(' • '));
      }
    }

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function getTemplateColors(template) {
  const themes = {
    classic: { primary: '#2c3e50', secondary: '#3498db', text: '#333333' },
    modern: { primary: '#6C63FF', secondary: '#FF6584', text: '#333333' },
    minimal: { primary: '#1a1a2e', secondary: '#16213e', text: '#444444' },
    creative: { primary: '#E74C3C', secondary: '#F39C12', text: '#333333' },
  };
  return themes[template] || themes.classic;
}

function addSectionHeader(doc, title, colors) {
  doc.fontSize(12).font('Helvetica-Bold').fillColor(colors.primary);
  doc.text(title);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor(colors.secondary).lineWidth(1).stroke();
  doc.moveDown(0.3);
}
