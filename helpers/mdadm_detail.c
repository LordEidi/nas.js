//
// gcc mdadm_detail.c -o mdadm_detail
//
// chown root:root mdadm_detail
// chmod 4755 mdadm_detail

#include <stdio.h>
#include <string.h>
#include <unistd.h>

int main(int argc, char *argv[])
{
    if (argc > 1)
    {
        char path[128] = "/sbin/mdadm";

        char * parmList[] = {"/sbin/mdadm", "--detail", argv[1], NULL};

        int ret = execvp (path, parmList);
        if (ret == -1) {
            perror("execve error");
        }
    }
    else
    {
        perror("missing argument");
    }

    return 1;
}
