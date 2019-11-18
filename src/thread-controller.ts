import Thread from './thread'
import Message from './message'
import { Request, Response } from 'express';
import { check, sanitize, validationResult } from 'express-validator'
import HttpStatus from 'http-status-codes'

export const createThread = async (req: Request, res: Response) => {
  const valid = async (val:string[]) => {
      let areValidNames = val.every((s:string) => { return /^[\w-]+$/.test(s) })
      if (!areValidNames)
        throw new Error('Names can only contain alphanumerics, "_", and "-"')

      return true
  }
  await check('users').isArray({ min: 1 }).withMessage('Provide an array of at least one user.').run(req)
  await check('users').custom(valid).withMessage('Names can only contain alphanumerics, "_", and "-"').run(req)

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() })
  } else {
    try {
      let canonicalName = req.body.users.join(',')

      let result = await Thread.findOne({name:canonicalName})
      if (!result) {
        let newThread = new Thread({ name: canonicalName, users: req.body.users })
        result = await newThread.save()
      }

      res.status(HttpStatus.OK).send({'thread_id': `${result.id}`})
    } catch (ex) {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: ex})
    }
  }
};


export const createMessage = async (req: Request, res: Response) => {
  const exists = async (val:Number) => {
      let result = await Thread.findOne({ id: val })

      if (!result)
        throw new Error('Provide an existing message id.')
      else {
        if(!result.users.includes(req.params.username))
          throw new Error('Provide an existing user on the thread.')
      }

      return true
  }
  await check('thread_id').isInt().withMessage('Thread id must be a number.').run(req)
  await check('thread_id').custom(exists).run(req)
  await check('message').exists().trim().escape().withMessage('Please provide a message.').run(req)

  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() })
  } else {
    try {
      let msg = new Message({
        threadId: req.params.thread_id,
        user: req.params.username,
        message: req.body.message
      })
      let result = await msg.save()

      res.sendStatus(HttpStatus.NO_CONTENT)
    } catch (ex) {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: ex})
    }
  }
}

export const getMessagesByThread = async (req: Request, res: Response) => {
  await check('thread_id').isInt().withMessage('Thread id must be a number.').run(req)

  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() })
  } else {
    let result = await Message.find({threadId: parseInt(req.params.thread_id)})
    let msgs = result.map((d) => { return { "username":d.get('user'), "message":d.get('message') }; })
    res.status(HttpStatus.OK).json({'messages':msgs})
  }
}
