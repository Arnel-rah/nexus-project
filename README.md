wget https://go.dev/dl/go1.23.0.linux-amd64.tar.gz

sudo tar -C /usr/local -xzf go1.23.0.linux-amd64.tar.gz

export PATH=$PATH:/usr/local/go/bin

source ~/.bashrc
go version