"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client"
import { auth } from "@/lib/auth";
import { headers } from "next/headers"
import {v4 as uuidv4 } from "uuid";
import AWS from 'aws-sdk'

const getSession = async (checkManager: boolean) => {
  const headerList = await headers()
  const session = await auth.api.getSession({
    headers: headerList
  })

  if (!session) {
    throw new Error("User must be signed in")
  }

  if (!session.user.isManager && checkManager) {
    throw new Error("User not permitted")
  }
  return session
}

export const createUser = async (name: string, username: string, 
      password:string, isManager:boolean) => {
  await getSession(true)

  const uuid = uuidv4();

  // Better auth will not allow signup without a "valid" email
  const email = uuid+"@"+uuid+".null"

  return auth.api.signUpEmail({
    body: {
      name:name,
      email:email,
      username: username,
      password: password,
      isManager: isManager
    }
  })
}

export const getUsers = async (limit: number, offset: number) => {
  await getSession(true)

  let count = await prisma.user.count({})

  let users = await prisma.user.findMany({})

  return { users: users, count: count } 
}

export const getUser = async (id: string) => {
  await getSession(false)

  return prisma.user.findFirst({
    where: {
      id: id
    }
  })
}

export const editUser = async (id: string, name: string, username: string, 
  isManager:boolean, password?:string) => {
  if (password === "") {
    password = undefined
  }

  let data = {
    name: name,
    username: username,
    isManager: isManager,
  }
  if (password) {
    data[password] = password
  }
  return prisma.user.update({
    data: data,
    where: {
      id: id
    }
  })
}

export const deleteUser = async (id: string) => {
  await getSession(true)

  return prisma.user.delete({
    where: {
      id: id
    }
  })
}

export const createGroup = async (name: string, users: string[]) => {
  await getSession(true)

  return prisma.group.create({
    data: {
      name: name,
      users: {
        connect: users.map((id) => ({id: id}))
      }
    }
  })
}

export const editGroup = async (id: number, name: string, users: string[]) => {
  return prisma.group.update({
    data: {
      name: name,
      users: {
        connect: users.map((id) => ({id: id}))
      }
    },
    where: {
      id: id
    }
  })
}

export const deleteGroup = async (id: number) => {
  await getSession(true)

  return prisma.group.delete({
    where: {
      id: id
    }
  })
}

export const getGroup = async (id: number) => {
  await getSession(false)

  return prisma.group.findFirst({
    where: {
      id: id
    }, include: {
      users: true,
    }
  })
}

export const getGroups = async (limit: number, offset: number) => {
  await getSession(true)

  let count = await prisma.group.count({})

  let groups = await prisma.group.findMany({})

  return { groups: groups, count: count } 
}

export const getQuizzes = async (manage: boolean) => {
  const session = await getSession(true)

  if (manage) {
    return prisma.quiz.findMany({
      orderBy: {
        expiresAt: {
          sort: "asc",
          nulls: "last"
        }
      }
    })
  } else {
    return prisma.quiz.findMany({
      where: {
        users: {
          some: {
            id: session.user.id
          }
        }
      },
      orderBy: {
        expiresAt: {
          sort: "asc",
          nulls: "last"
        }
      }
    })
  }
}

export const getQuiz = async (id: number) => {
  return prisma.quiz.findFirst({
    where: {
      id: id
    },
    include: {
      questions: true,
      users: true,
      groups: true
    }
  })
}

interface CreateQuizInput {
  id: number,
  data: {}
}

export const assignQuiz = async (id: number, groups: string[], users: string[]) => {
  return prisma.quiz.update({
    data: {
      users: {
        connect: users.map((id) => ({id: id}))
      },
      groups: {
        connect: groups.map((id)=>({id: parseInt(id)}))
      }
    },
    where: {
      id: id
    }
  })
}

export const editQuizWithQuestions = async (id:number, name:string, time:string, quizObjects:CreateQuizInput[]) => {
  await getSession(true)
  try{
    let questions = []
    for (let i = 0; i < quizObjects.length; i++) {
      const question = {
        data: JSON.stringify(quizObjects[i].data),
        type: parseInt(quizObjects[i].data["questionTypeDropdown"]),
        id: quizObjects[i].id
      }
      questions.push(question)
    }

    for (let i = 0; i < questions.length; i++) {
      await prisma.quiz.update({
        where: {
          id: id
        },
        data: {
          name: name,
          expiresAt: (time?new Date(time):null),
          questions: {
            upsert: {
              create: questions[i],
              update: questions[i],
              where: {
                id: questions[i].id
              }
            },
          }
        },
      })
    }
  } catch (e) {
    throw e
  }
}

export const createQuizWithQuestions = async (name:string, time?:string, quizObjects:CreateQuizInput[]) => {
  await getSession(true)
  try{
    let questions = []
    for (let i = 0; i < quizObjects.length; i++) {
      const question = {
        data: JSON.stringify(quizObjects[i].data),
        type: parseInt(quizObjects[i].data["questionTypeDropdown"])
      }
      questions.push(question)
    }

    await prisma.quiz.create({
      data: {
        name: name,
        expiresAt: (time?new Date(time):null),
        questions: {
          create: questions
        }
      }
    })
  } catch (e) {
    throw e
  }
}

export const deleteQuiz = async (id: number) => {
  await getSession(true)

  return prisma.quiz.delete({
    where: {
      id: id
    }
  })
}

export const addResponse = async (sessID: string, userID: string, questionID: number, response: string) => {
  return prisma.answer.create({
    data: {
      user: {
        connect: {id: userID}
      },
      question: {
        connect: {id: questionID}
      },
      response: response,
      sessionID: sessID
    }
  })
}

export const getQuizResponses = async (quizID: number) => {
  const responses = await getQuiz(quizID)

  return prisma.answer.findMany({
    where: {
      question: {
        id: {
          in: responses.questions.map((q)=>{return q.id})
        }
      }
    },
    include: {
      user: true,
      question: true
    }
  })
}

export const uploadFile = async (name: string, data: string) => {
  const S3_BUCKET = process.env.AWS_BUCKET_NAME;
  const REGION = process.env.AWS_REGION;

  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY,
  });
  const s3 = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
  });

  const params = {
    Bucket: S3_BUCKET,
    Key: name,
    Body: data,
  };

  var upload = s3
    .putObject(params)
    .on("httpUploadProgress", (evt) => {
      /*console.log(
        "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
      );*/
    })
    .promise();

  await upload.then((err, data) => {
    console.log(err);
    //alert("File uploaded successfully.");
  });
};

export const getFile = async (name: string) => {
  const S3_BUCKET = process.env.AWS_BUCKET_NAME;
  const REGION = process.env.AWS_REGION;

  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY,
  });
  const s3 = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
  });

  const params = {
    Bucket: S3_BUCKET,
    Key: name,
  };

  var get = s3
    .getObject(params)
    .promise();

  let g = await get
  const body = g.Body
  
  return body
};