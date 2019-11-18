## The Knock Challenge


### Prerequisites

1. Docker

    + [Windows] (https://docs.docker.com/docker-for-windows/install/)
    + [Mac] (https://download.docker.com/mac/stable/Docker.dmg)

### Up & Running

If you successfully installed Docker or already have it on your machine, you can get started with,

```
git clone git@github.com:aedenj/the-knock-challenge.git ~/projects/the-knock-challenge
cd ~/projects/the-knock-challenge/;docker-compose up app mongo
```

Wait just a couple moments for the app to start then you can explore the various endpoints using,


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

#### GET /thread/:thread_id
```
curl -H "Content-Type: application/json" http://localhost:3000/thread/1
```


### Testing

Since I did the database bonus I opted to take a more end-to-end testing approach for this MVP as opposed to mock heavy unit testing.

In a terminal lets run

```
cd ~/projects/the-knock-challenge/;docker-compose down
docker-compose up tests mongo
```
