import mongoose from 'mongoose';
import NewCampModel from './models/Camp.js';

async function updateCampAvailability() {
    await mongoose.connect('mongodb://127.0.0.1:27017/', { useNewUrlParser: true, useUnifiedTopology: true });

    const camps = await NewCampModel.find();

    for (const camp of camps) {
        if (!camp.availability || camp.availability.length === 0) {
            camp.availability = [{
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year from now
                units: camp.numberOfUnits
            }];
            await camp.save();
        }
    }

    console.log('Camp availability updated.');
    mongoose.disconnect();
}

updateCampAvailability();
