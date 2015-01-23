//
// gcc smartctl_h.c -o smartctl_h
//
// chown root:root smartctl_h
// chmod 4755 smartctl_h

#include <stdio.h>
#include <string.h>
#include <unistd.h>

int main(int argc, char *argv[])
{
    if (argc > 1)
    {
        char path[128] = "/usr/sbin/smartctl";

        char * parmList[] = {"/usr/sbin/smartctl", "-iH", argv[1], NULL};

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
