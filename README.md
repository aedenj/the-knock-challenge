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
