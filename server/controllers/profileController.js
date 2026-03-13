import Profile from "../models/Profile.js";

export const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();

    if (!profile) {
      profile = await Profile.create({
        fullName: "Navaneethan Karunashankar",
        email: "kjnavaneethan019@gmail.com",
        phone: "+94 764304068",
        location: "Jaffna, Sri Lanka",
        bio: "Motivated Software Engineering student."
      });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();

    if (!profile) {
      profile = await Profile.create(req.body);
    } else {
      profile.fullName = req.body.fullName;
      profile.email = req.body.email;
      profile.phone = req.body.phone;
      profile.location = req.body.location;
      profile.bio = req.body.bio;

      await profile.save();
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};