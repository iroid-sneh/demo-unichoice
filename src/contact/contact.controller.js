import contactSerices from "./contact.service";

class contactController {
    /**
     * @description: Contact Info of the User
     * @param {*} req
     * @param {*} res
     */
    static async contactForm(req, res) {
        const data = await contactSerices.contactForm(req.body, req, res);
        return;
    }
}

export default contactController;
