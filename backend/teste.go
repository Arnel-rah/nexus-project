package main

import (
	"fmt"
	"time"
)

func test(){
	second := time.Second
fmt.Print(int64(second/time.Millisecond))
}