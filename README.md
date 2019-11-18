## The Knock Challenge


### Prerequisites

1. Docker

    + [Windows] (https://docs.docker.com/docker-for-windows/install/)
    + [Mac] (https://download.docker.com/mac/stable/Docker.dmg)

### Up & Running

If you successfully installed Docker or already have it on your machine, you should be able to get started with the app with,

```
git clone git@github.com:aedenj/the-knock-challenge.git ~/projects/the-knock-challenge
cd ~/projects/the-knock-challenge/;docker-compose up app mongo
```

You can explore the various endpoints using


#### POST /thread
```
curl -d '{"users":["kiefer", "jeff_goldblum", "aeden"]}' -H "Content-Type: application/json" -X POST http://localhost:3000/thread
```

#### POST /thread/:thread_id/:username
```
curl -d '{"message": "Hey Jeff"}' -H "Content-Type: application/json" -X POST http://localhost:3000/thread/1/aeden
```
```
curl -d '{"message": "Hey Aeden"}' -H "Content-Type: application/json" -X POST http://localhost:3000/thread/1/jeff_goldblum
```
```
curl -d '{"message": "Hey Everyone"}' -H "Content-Type: application/json" -X POST http://localhost:3000/thread/1/kiefer
```
