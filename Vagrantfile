Vagrant.configure(2) do |config|
	config.vm.box = "ubuntu/trusty64"
	config.vm.hostname = "project-development"
	config.vm.network 'forwarded_port', guest: 80, host: 8080
	config.ssh.shell = "bash -c 'BASH_ENV=/etc/profile exec bash'"
	config.vm.provision :shell, path: "bootstrap.sh"
	config.vm.synced_folder ".", "/vagrant",
		mount_options: ["dmode=777","fmode=666"]
end
