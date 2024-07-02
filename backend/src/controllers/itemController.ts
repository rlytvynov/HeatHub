import { Request, Response } from "express";
import Tubular from "../models/tubular.entity.js";
import Bps from "../models/bps.entity.js";

const itemController = {
    getItems: async function (req: Request, res: Response) {
        try {
            switch (req.params.type) {
                case "tubulars":
                    const tubulars = await Tubular.find({}).exec()
                    const modifiedTubulars = tubulars.map(tubular => {
                        const {_id, ...itemObj} = tubular.toObject()
                        return ({id: _id.toString(), ...itemObj})
                    });
                    return res.status(200).json(modifiedTubulars)
                case "bps":
                    const bps = await Bps.find({}).exec()
                    console.log("a")
                    const modifiedBps = bps.map(item => {
                        const {_id, ...itemObj} = item.toObject()
                        return ({id: _id.toString(), ...itemObj})
                    });
                    return res.status(200).json(modifiedBps)
                default: return res.status(404).json({message: "Not Found"})
            }
        } catch (error) {
            
        }
    },
}

export default itemController